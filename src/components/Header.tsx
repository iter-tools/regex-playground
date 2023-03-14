import Link from "next/link";

function Header() {
  return (
    <header>
      <Link href=".">
        <img src="favicon.ico" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href=".">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
