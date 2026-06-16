import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer__content footer__content--fluid-width footer__content--svg">
        <div className="container">
          <div className="grid grid--5col">
            <div className="grid__item grid__item--x2">
              <ul className="grid__list grid__list--fmenu">
                <li>
                  <h5 id="footer-cc">Copyright &copy; {year} ENACT Program</h5>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
