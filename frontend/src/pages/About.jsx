function About() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-semibold text-gray-300 mb-4">
        About Blog Posts
      </h1>

      <p className="text-gray-300 pl-2.5">
        This is a blog posts website where users can explore, read, and discover
        blogs across different categories. The platform showcases content
        created by multiple users, making it easy to browse recent posts and
        find topics of interest in one place.
      </p>
      <h2 className="px-8 py-5 text-xl font-semibold">Future works</h2>
      <ol className="p-10 list-decimal list-inside">
        <li>To add followers for each user</li>
        <li>To add chats section sub-divided into chats and groups managed by mentors and admins</li>
        <li>Add infinite scroll to homepage blogs</li>
        <li>Users to save blogs and view in saved blogs section</li>
        <li>Users to create blogs without images</li>
        <li>Users to search and find the mentor and developers</li>
        <li>Improve UI stability and experience</li>
        <li>Optimize api fetches</li>
        <li>Add more Admin functionalities</li>
      </ol>
    </div>
  );
}

export default About;
