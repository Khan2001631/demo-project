import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer className="">
        <div className="text-end p-5 me-5">
          <a className="h6 text-decoration-none" target="_blank" href="https://bluecallom.com/about">
            {t('links.about.label')}
          </a> | <a className="h6 text-decoration-none" target="_blank" href="https://bluecallom.com/contact">
            {t('links.contact.label')}
          </a> | <a className="h6 text-decoration-none" target="_blank" href="https://bluecallom.com/terms/">
            {t('links.terms.label')}
          </a>
        </div>
      </footer>
    </>
  )
}

export default Footer;