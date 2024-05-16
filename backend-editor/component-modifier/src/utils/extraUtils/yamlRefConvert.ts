import { Document, Schema } from "yaml";

type RecordAny = Record<string, any>;

export function convertToYamlWithRefs(input: RecordAny): string {
  const doc = new Document(input);
  const cache = new Map<string, any>();

  function serialize(obj: any): string | null {
    try {
      return JSON.stringify(obj);
    } catch {
      return null; // Handle non-serializable values
    }
  }

  function manageAnchorsAndAliases(obj: any, path: string[] = []): void {
    if (obj && typeof obj === "object") {
      const serialized = serialize(obj);
      if (serialized === null) return;

      if (cache.has(serialized)) {
        const node = cache.get(serialized);
        doc.setIn(path, doc.createAlias(node));
      } else {
        cache.set(serialized, doc.getIn(path));
        Object.keys(obj).forEach((key) => {
          manageAnchorsAndAliases(obj[key], [...path, key]);
        });
      }
    }
  }

  manageAnchorsAndAliases(input);

  return doc.toString();
}
