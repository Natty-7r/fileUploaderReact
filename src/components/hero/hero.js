import Navbar from "../navbar/navbar";
import "./hero.scss";
export default function Hero() {
  return (
    <section class="hero">
      <Navbar />
      <div class="hero_main">
        <div class="hero_text-name">nane furniture</div>
        <div class="hero_text-bold">
          furniture &<br />
          metal works
        </div>
        <div class="hero_text-ligther">modern and luxurius furnitures</div>
        <button class="btn btn_hero">Order now</button>
      </div>
      <img
        class="hero_image"
        src="./images/t.png"
        alt="hero image"
      />
    </section>
  );
}
