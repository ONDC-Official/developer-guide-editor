export type X_ATTRIBUTES = Record<
  string,
  { attribute_set: Record<string, any> }
>;
export type X_ENUM = Record<string, any>;
export type X_TAGS = Record<string, any>;
export type X_FLOWS = {
  summary: string;
  description?: string;
  details: { description?: string; mermaid?: string }[];
  references: string;
  steps: {
    summary?: string;
    api?: string;
    references?: string;
    details?: { description: string; mermaid: string }[];
    example?: {
      value: any;
    };
  };
}[];
export type X_EXAMPLES = Record<
  string,
  {
    summary: string;
    description: string;
    example_set: Record<
      string,
      { examples: { summary: string; description: string; value: any }[] }
    >;
  }
>;
export interface BUILD_TYPE {
  "x-enum"?: X_ENUM;
  "x-tags"?: X_TAGS;
  "x-flows"?: X_FLOWS;
  "x-examples"?: X_EXAMPLES;
  "x-attributes"?: X_ATTRIBUTES;
}
