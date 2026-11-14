import { SiteContent } from "../types";
import { getDummyState, saveDummyState } from "../mock/store";

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSiteContentService(): Promise<SiteContent> {
  await delay();
  return getDummyState().siteContent;
}

export async function updateSiteContentService(content: SiteContent): Promise<SiteContent> {
  await delay();
  const state = getDummyState();
  saveDummyState({ ...state, siteContent: content });
  return content;
}

