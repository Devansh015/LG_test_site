import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { siteContent } from "./schema";
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId)
  throw new Error(
    "Add SANITY_STUDIO_PROJECT_ID to cms/.env before starting the Studio.",
  );
export default defineConfig({
  name: "valore",
  title: "Valore Property Group",
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .title("Valore website")
              .child(
                S.document()
                  .schemaType("siteContent")
                  .documentId("siteContent"),
              ),
          ]),
    }),
  ],
  schema: { types: [siteContent] },
  document: {
    newDocumentOptions: () => [],
    actions: (actions, context) =>
      context.schemaType === "siteContent"
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action || "",
              ),
          )
        : actions,
  },
});
