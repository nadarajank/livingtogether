import React from 'react';
import ReactDOM from 'react-dom/client';
import { CheckCircle2, Globe2, Heart, LockKeyhole, Sparkles, UsersRound } from 'lucide-react';
import * as THREE from 'three';
import './styles.css';

function ThreeHeartField() {
  const mountRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const colors = [0xff3b6b, 0xffc247, 0x22c55e, 0x38bdf8, 0x8b5cf6];
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(0.16, 1);
    const items = Array.from({ length: 95 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: colors[index % colors.length],
        transparent: true,
        opacity: 0.76,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const radius = 2.2 + Math.random() * 3.7;
      const angle = Math.random() * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 5.2, Math.sin(angle) * radius);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData = { speed: 0.003 + Math.random() * 0.006, drift: Math.random() * Math.PI * 2 };
      group.add(mesh);
      return mesh;
    });

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0.34);
    heartShape.bezierCurveTo(-1.25, -0.55, -1.9, 0.82, -0.72, 1.55);
    heartShape.bezierCurveTo(-0.18, 1.88, 0, 1.38, 0, 1.08);
    heartShape.bezierCurveTo(0, 1.38, 0.18, 1.88, 0.72, 1.55);
    heartShape.bezierCurveTo(1.9, 0.82, 1.25, -0.55, 0, 0.34);
    const heartGeometry = new THREE.ShapeGeometry(heartShape);
    const heartMaterial = new THREE.MeshBasicMaterial({ color: 0xff3b6b, transparent: true, opacity: 0.18 });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.scale.set(1.55, 1.55, 1.55);
    heart.position.set(1.75, -0.8, -0.5);
    scene.add(heart);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    let frameId = 0;
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      group.rotation.y += 0.0028;
      group.rotation.x = Math.sin(Date.now() * 0.00035) * 0.12;
      items.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.speed;
        mesh.rotation.y += mesh.userData.speed * 1.6;
        mesh.position.y += Math.sin(Date.now() * 0.001 + mesh.userData.drift) * 0.0009;
      });
      heart.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      heartGeometry.dispose();
      heartMaterial.dispose();
      items.forEach((mesh) => (mesh.material as THREE.Material).dispose());
      renderer.dispose();
    };
  }, []);

  return <div className="three-scene" ref={mountRef} aria-hidden="true" />;
}

const countries = ['India', 'America', 'Canada', 'England', 'Australia', 'Germany', 'Spain'];

const promises = [
  { icon: Heart, title: 'Love & Affection', text: 'We wish every member a life filled with warmth, peace, and care.' },
  { icon: Globe2, title: 'Global Matches', text: 'BAJOL is designed for people across seven countries to find better matches.' },
  { icon: LockKeyhole, title: 'Secure Details', text: 'Your profile information is handled with privacy, trust, and safety in mind.' },
];

function App() {
  return (
    <main>
      <section className="hero">
        <ThreeHeartField />
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="BAJOL home">
            <span>B</span>
            BAJOL
          </a>
          <div className="nav-actions">
            <a href="#trust">Trust</a>
            <a href="#register">Register</a>
          </div>
        </nav>

        <div className="hero-content" id="top">
          <p className="eyebrow">Living together globally</p>
          <h1>BAJOL</h1>
          <p className="tagline">A colorful platform for people ready to build love, affection, and peaceful companionship.</p>
          <div className="hero-actions">
            <a className="primary-button pulse" href="#register">Do Register Now</a>
            <a className="secondary-button" href="#profile">See Daily Profile</a>
          </div>
          <div className="hero-stats" aria-label="BAJOL highlights">
            <div><strong>7</strong><span>Countries</span></div>
            <div><strong>100%</strong><span>Trust focus</span></div>
            <div><strong>25-45</strong><span>Profile range</span></div>
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-copy">
          <p className="eyebrow">One platform, many hearts</p>
          <h2>Better matches for living together life.</h2>
          <p>
            BAJOL brings hopeful people into one bright, respectful space where profiles, countries, and intentions are
            easy to understand.
          </p>
        </div>
        <div className="couple-panel" id="profile">
          <div className="profile-orbit">
            <div className="person person-a" />
            <div className="person person-b" />
            <Heart size={42} />
          </div>
          <div>
            <span className="badge">Daily updated profile</span>
            <h3>Unlimited profile view</h3>
            <p>Colorful profile presentation for registered members, with clear details and simple next actions.</p>
          </div>
        </div>
      </section>

      <section className="promise-grid" aria-label="BAJOL promises">
        {promises.map((item) => (
          <article key={item.title} className="promise-card">
            <item.icon size={28} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="countries-section">
        <div className="section-copy">
          <p className="eyebrow">Micro payments, wider reach</p>
          <h2>Functioning across seven countries.</h2>
        </div>
        <div className="country-strip">
          {countries.map((country, index) => (
            <span key={country} style={{ '--i': index } as React.CSSProperties}>{country}</span>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div className="quote-media">
          <UsersRound size={72} />
          <Sparkles size={32} />
        </div>
        <div>
          <p>Love is the bridge between two hearts.</p>
          <p>When words fail, love speaks.</p>
          <p>A great life is not when a perfect match comes together, but when an imperfect match learns to enjoy their differences.</p>
        </div>
      </section>

      <section className="trust-section" id="trust">
        <div className="trust-light" />
        <div className="section-copy">
          <p className="eyebrow">A light in your life</p>
          <h2>Built around trust, safety, and clear registration.</h2>
          <p>BAJOL presents itself as a dependable place for serious people looking toward companionship and family life.</p>
        </div>
        <div className="trust-list">
          <span><CheckCircle2 size={20} /> Secure personal details</span>
          <span><CheckCircle2 size={20} /> Registered member flow</span>
          <span><CheckCircle2 size={20} /> Daily profile updates</span>
        </div>
      </section>

      <section className="register-section" id="register">
        <div>
          <p className="eyebrow">Open your heart</p>
          <h2>Look, connect, and move toward your heart freely.</h2>
        </div>
        <form className="register-form">
          <label>
            Name
            <input type="text" placeholder="Your full name" />
          </label>
          <label>
            Country
            <select defaultValue="">
              <option value="" disabled>Select country</option>
              {countries.map((country) => <option key={country}>{country}</option>)}
            </select>
          </label>
          <label>
            Age
            <input type="number" min="18" max="80" placeholder="30" />
          </label>
          <button type="button" className="primary-button pulse">I Done</button>
        </form>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
