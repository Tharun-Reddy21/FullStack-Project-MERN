import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" border-t border-white">
      <div className="w-full max-w-5xl mx-auto px-4 py-6 font-sans">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5 ">
            <Link
              to="/"
              className="flex items-center gap-0.5 text-2xl font-bold text-white">
              <span className="bg-violet-900 px-2 pt-1 pb-1.5 text-white gap-0.5 rounded-2xl w-fit">
                Blog
              </span>
              Posts
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-3 text-sm font-bold uppercase text-white">
                About </h2>
                
              <ul className="text-gray-400">
                <li className="mb-2">
                  <a  href=""  target="_blank"  rel="noopener noreferrer"
                    className="hover:underline">
                    Projects
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-bold text-gray-900 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <a
                    href="https://github.com/Tharun-Reddy21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
