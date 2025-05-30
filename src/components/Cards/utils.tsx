import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

interface Frontmatter {
  type: string;
  title: string;
}

interface ParsedNotificationMarkdown {
  notificationContent: string;
  notificationType?: string;
  notificationTitle?: string;
}

interface ParsedHelpMarkdown {
  helpContent: string;
  helpTitle: string;
}

export const parseNotificationMarkdown = (
  markdown: string
): ParsedNotificationMarkdown => {
  const {
    data: { frontmatter },
    value,
  } = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkParseFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdown);

  const parsedFrontmatter = frontmatter as Frontmatter;

  return {
    notificationContent: String(value),
    notificationTitle: parsedFrontmatter?.title,
    notificationType: parsedFrontmatter?.type,
  };
};

export const parseHelpMarkdown = (markdown: string): ParsedHelpMarkdown => {
  const {
    data: { frontmatter },
    value,
  } = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkParseFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdown);

  const parsedFrontmatter = frontmatter as Frontmatter;
  return {
    helpContent: String(value),
    helpTitle: parsedFrontmatter?.title,
  };
};
