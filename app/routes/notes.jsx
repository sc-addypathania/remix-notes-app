import { json, redirect } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

let inMemoryNotes = {"notes":[{"title":"New Notes","content":"A new note!","id":"2022-10-19T11:10:56.831Z"},{"title":"Remix is awesome!","content":"It really is!","id":"2022-10-19T11:16:55.247Z"}]};

export async function loader() {
  const notes = inMemoryNotes.notes;
  if (!notes || notes.length === 0) {
    throw json(
      { message: 'Could not find any notes.' },
      {
        status: 404,
        statusText: 'Not Found',
      }
    );
  }
  return notes;
}



export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: 'Invalid title - must be at least 5 characters long.' };
  }

  noteData.id = new Date().toISOString();
  inMemoryNotes.notes.push(noteData);
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function meta() {
  return {
    title: 'All Notes',
    description: 'Manage your notes with ease.',
  };
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || 'Data not found.';

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>!
      </p>
    </main>
  );
}
