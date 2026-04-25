// Main app
useReveal; // ensure parsed

const App = () => {
  useReveal();
  // Smooth-scroll for anchor links
  React.useEffect(()=>{
    const onClick = (e)=>{
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el){ e.preventDefault(); window.scrollTo({ top: el.offsetTop - 20, behavior:'smooth' }); }
    };
    document.addEventListener('click', onClick);
    return ()=>document.removeEventListener('click', onClick);
  },[]);
  return (
    <>
      <Cursor/>
      <Nav/>
      <main>
        <Hero/>
        <About/>
        <Stats/>
        <Skills/>
        <Work/>
        <Clients/>
        <Pricing/>
        <Contact/>
        <Footer/>
      </main>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
