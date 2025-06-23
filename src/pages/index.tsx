import Head from "next/head";
import TaskManager from "~/components/TaskManager";

export default function Home() {
  return (
    <>
      <Head>
        <title>Simple Task Manager</title>
        <meta name="description" content="A simple task management app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-8">
          <TaskManager />
        </div>
      </main>
    </>
  );
}
