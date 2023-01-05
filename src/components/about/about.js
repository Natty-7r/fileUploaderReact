import "./about.scss";
export default function About() {
  return (
    <section
      className="section about"
      id="about">
      <h2 className="section_title">about us</h2>
      <div className="about_main">
        <div className="about_text">
          <h3 className="about_text-header"></h3>
          <p className="about_text-content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            aut nobis, blanditiis rerum omnis consequuntur impedit accusamus
            aliquam ratione amet eum deleniti commodi! Laborum nihil ut delectus
            asperiores explicabo exercitationem?
          </p>
        </div>
        <div className="about_image"></div>
      </div>
    </section>
  );
}
