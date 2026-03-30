import { Document } from "@server/models";
import type { DocumentEvent, Event } from "@server/types";
import OpenAIService from "@server/services/openai";
import BaseProcessor from "./BaseProcessor";

export default class DocumentAIIndexProcessor extends BaseProcessor {
  static applicableEvents: Event["name"][] = [
    "documents.publish",
    "documents.update",
  ];

  async perform(event: DocumentEvent) {
    const document = await Document.findByPk(event.documentId, {
      rejectOnEmpty: true,
    });

    if (!document.text || document.text.trim().length === 0) {
      return;
    }

    try {
      await OpenAIService.indexDocument({
        id: document.id,
        title: document.title,
        text: document.text,
        collectionId: document.collectionId,
      });
    } catch (err) {
      console.error("Error indexing document in AI:", err);
    }
  }
}
