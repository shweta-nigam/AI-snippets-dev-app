import { ISnippet } from "@/types/snippet";
import { db } from "../db/db";

export const createSnippet = async (
  title: string,
  code: string,
  language: string,
  tags: string
) => {
  try {
    await db.runAsync(
      `
      INSERT INTO snippets (title, code, language, tags)
      VALUES (?, ?, ?, ?)
      `,
      [title, code, language, tags]
    )
  } catch (error) {
    console.error(error);
  }
}

export const getAllSnippets = async () => {
  try {
    const result = await db.getAllAsync(`
SELECT * FROM snippets
ORDER BY createdAt DESC
            `)

    return result
  } catch (error) {
    console.error(error);
    return []
  }
}
export const getSnippetById = async (id: string): Promise<ISnippet | null> => {
  try {
    const result = await db.getFirstAsync(`
    SELECT * FROM snippets WHERE id = ?
    `,
      [id]
    )

    return result as ISnippet
  } catch (error) {
    console.error(error);
    return null
  }
}

export const updateSnippet = async (
  id: string,
  title: string,
  code: string,
  language: string,
  tags: string
) => {
  try {
    await db.runAsync(
      `
    UPDATE snippets
    SET
      title = ?,
      code = ?,
      language = ?,
      tags = ?
    WHERE id = ?
    `,
      [title, code, language, tags, id]
    );
  } catch (error) {
    console.error(error)
  }

}

export const deleteSnippet = async (id: number) => {
  try {
    await db.runAsync(
      `
      DELETE FROM snippets
      WHERE id = ?
      `,
      [id]
    );
  } catch (error) {
    console.error(error);
  }
}

export const toggleFavorite = async (
  id: number,
  isFavorite: number
) => {
  try {
    await db.runAsync(
      `
      UPDATE snippets
      SET isFavorite = ?
      WHERE id = ?
      `,
      [isFavorite, id]
    );
  } catch (error) {
    console.log(error);
  }
};

export const getFavoriteSnippets = async () => {
  try {
    const result = await db.getAllAsync(`
      SELECT *
      FROM snippets
      WHERE isFavorite = 1
      ORDER BY id DESC
    `);

    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const searchSnippets = async (query: string) => {
  try {
    const result = await db.getAllAsync(
      `
      SELECT * FROM snippets
      WHERE title LIKE ?
      ORDER BY createdAt DESC
      `,
      [`%${query}%`]
    );
    // % = wildcard in sql
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};



// snippet.service file -- uses the db connection ( of db.ts file) to perform the CRUD