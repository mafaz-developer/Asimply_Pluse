export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/5 text-white/80">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm">© {new Date().getFullYear()} Asimply Pluse • All rights reserved</p>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#dao" className="hover:text-white">DAO Voting</a>
          <a href="#support" className="hover:text-white">Support</a>
          <a href="#social" className="hover:text-white">Twitter</a>
          <a href="#social" className="hover:text-white">Discord</a>
        </nav>
      </div>
    </footer>
  );
}
