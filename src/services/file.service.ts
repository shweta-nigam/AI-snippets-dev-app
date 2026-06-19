import * as DocumentPicker from "expo-document-picker";
import { cacheDirectory, readAsStringAsync, writeAsStringAsync } from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { createSnippet, getAllSnippets } from "./snippet.service";

// Inferred language list mapping
const langMap: { [key: string]: string } = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  html: "html",
  css: "css",
  json: "json",
  java: "java",
  cpp: "cpp",
  c: "c",
  sh: "bash",
  md: "markdown",
  rb: "ruby",
  go: "go",
  rs: "rust",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  yaml: "yaml",
  yml: "yaml",
  sql: "sql",
};

export const importSnippetFromFile = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, message: "Import cancelled by user" };
    }

    const asset = result.assets[0];
    if (!asset || !asset.uri) {
      return { success: false, message: "Invalid file selection" };
    }

    const fileContent = await readAsStringAsync(asset.uri, {
      encoding: "utf8" as any,
    });

    // Inferred language
    const extension = asset.name.split(".").pop()?.toLowerCase() || "";
    const language = langMap[extension] || "text";

    // Insert into DB
    await createSnippet(asset.name, fileContent, language, "imported, file");

    return { success: true, message: `Successfully imported "${asset.name}"` };
  } catch (error) {
    console.error("Error importing file:", error);
    return { success: false, message: "Failed to read or import the selected file" };
  }
};

export const exportSnippetsToFile = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      return { success: false, message: "Sharing is not supported on this device" };
    }

    const snippets = await getAllSnippets();
    if (!snippets || snippets.length === 0) {
      return { success: false, message: "No snippets found in database to export" };
    }

    const jsonString = JSON.stringify(snippets, null, 2);
    const fileUri = `${cacheDirectory}dev_snippets_backup.json`;

    await writeAsStringAsync(fileUri, jsonString, {
      encoding: "utf8" as any,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export Code Snippets Backup",
      UTI: "public.json",
    });

    return { success: true, message: "Snippets backup exported successfully" };
  } catch (error) {
    console.error("Error exporting snippets:", error);
    return { success: false, message: "Failed to compile or share the snippets data" };
  }
};
