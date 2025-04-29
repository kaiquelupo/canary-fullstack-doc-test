export const addScriptsToHTML = (html: string, url: string) => {
  // This function adds a script to the HTML to sync the scroll position
  // between the iframe and the parent window

  return html.replace(
    '</body>',
    `
        <script>
            let isSyncingScroll = false;

            // Send scroll event to parent
            window.addEventListener("scroll", () => {

                // Avoid infinite loop
                if (isSyncingScroll) {
                    isSyncingScroll = false;
                    return;
                }

                window.parent.postMessage(
                    {
                        type: "iframeScroll",
                        x: window.scrollX,
                        y: window.scrollY,
                        url: "${url}"
                    },
                    "${process.env.FRONT_URL}"
                );
            });

            // Listen for commands from parent
            window.addEventListener("message", (event) => {
                if (event.origin !== "${process.env.FRONT_URL}") return;

                if (event.data?.type === "setScroll") {
                    isSyncingScroll = true;
                    const { x = 0, y = 0 } = event.data;
                    window.scrollTo(x, y);
                }
            });
        </script>
    </body>
    `,
  );
};

export const replaceSrcs = (html: string, prefix: string) => {
  /*
        Because of the proxing, the srcs are relative to the url
        So we need to get the url from the prefix
        and replace the srcs with the url + src
    */

  const url = prefix.slice(0, prefix.lastIndexOf('/') + 1);
  return html.replace(/<img\s+[^>]*src=["']([^"']+)["']/gi, (match, src) => {
    const newSrc = url + src;
    return match.replace(src, newSrc);
  });
};
