document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.navlist');
  if (!nav) return;

  // Only links that point to sections on the page
  const links = nav.querySelectorAll('li > a[href^="#"]');

  // Map links to their sections and their parent <li>
  const items = Array.from(links).map(link => {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    return section ? { section, link, li: link.closest('li') } : null;
  }).filter(Boolean);

  // Helper to set active <li>.uno
  function setActive(liActive) {
    items.forEach(({ li }) => li.classList.remove('uno'));
    if (liActive) liActive.classList.add('uno');
  }

  // IntersectionObserver: highlight whichever section is in the focus band
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const item = items.find(it => it.section === entry.target);
      if (!item) return;
      if (entry.isIntersecting) setActive(item.li);
    });
  }, {
    // Create a middle band so the highlight feels right as you scroll
    root: null,
    rootMargin: '-20% 0px -60% 0px', // top/bottom margins of the viewport
    threshold: 0      // trigger when the section enters the band
  });

  items.forEach(({ section }) => observer.observe(section));

  // Optional: set correct active state on load/refresh
  // If none intersect immediately, fall back to the section nearest top
  window.addEventListener('load', () => {
    let nearest = null, min = Infinity, top = window.scrollY;
    items.forEach(({ section }) => {
      const d = Math.abs(section.getBoundingClientRect().top);
      if (d < min) { min = d; nearest = section; }
    });
    if (nearest) {
      const found = items.find(it => it.section === nearest);
      if (found) setActive(found.li);
    }
  });
});