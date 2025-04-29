export interface Filing {
  url: string;
  type: string;
  date: Date;
}

export interface LastAndPreviousDocuments {
  last: Filing;
  previous: Filing | undefined;
}
