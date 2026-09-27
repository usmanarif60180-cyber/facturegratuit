(function () {
  const groups = [
    ['Vue d’ensemble', ['dashboard', 'ai', 'reports']],
    ['Facturation', ['invoices', 'quotes', 'clients', 'companies', 'design-studio']],
    ['Gestion', ['crm', 'leads', 'projects', 'tasks', 'calendar', 'inventory', 'expenses', 'team', 'files']],
    ['Ressources', ['tools', 'resources', 'country']]
  ];
  function closeMenus() {
    document.querySelectorAll('.mobile-menu-open').forEach(view => {
      view.classList.remove('mobile-menu-open');
      view.querySelector('.workspace-menu')?.setAttribute('aria-expanded', 'false');
    });
  }
  function polish() {
    document.querySelectorAll('.app-nav:not([data-polished])').forEach(nav => {
      nav.dataset.polished = 'true';
      const links = [...nav.querySelectorAll('a')];
      groups.forEach(([label, ids]) => {
        const heading = document.createElement('div');
        heading.className = 'nav-group';
        heading.textContent = label;
        nav.append(heading);
        ids.forEach(id => {
          const link = links.find(link => link.dataset.goto === id);
          if (link) nav.append(link);
        });
      });
    });
    document.querySelectorAll('.app-topbar:not([data-polished])').forEach(bar => {
      bar.dataset.polished = 'true';
      const button = document.createElement('button');
      button.className = 'btn btn-outline workspace-menu';
      button.type = 'button';
      button.textContent = '\u2630';
      button.title = 'Navigation';
      button.setAttribute('aria-label', 'Navigation');
      button.setAttribute('aria-expanded', 'false');
      button.onclick = () => {
        const open = bar.closest('.view').classList.toggle('mobile-menu-open');
        button.setAttribute('aria-expanded', String(open));
      };
      bar.prepend(button);
    });
    document.querySelectorAll('#invoices-table tbody tr,#quotes-table tbody tr').forEach(row => {
      const cell = row.lastElementChild;
      if (!cell || cell.querySelector('details') || cell.querySelectorAll('button').length < 3) return;
      const menu = document.createElement('details');
      menu.className = 'row-actions';
      const summary = document.createElement('summary');
      summary.textContent = 'Actions \u22ef';
      menu.append(summary);
      while (cell.firstChild) menu.append(cell.firstChild);
      cell.style.display = 'table-cell';
      cell.append(menu);
    });
  }
  const hero = document.querySelector('.ai-command-hero');
  const form = document.getElementById('dash-ai-copilot-form');
  if (hero && form) {
    hero.firstElementChild.append(form);
    form.style.marginTop = '16px';
  }
  document.addEventListener('click', event => {
    if (event.target.closest('[data-goto]')) closeMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenus();
  });
  polish();
  new MutationObserver(polish).observe(document.body, { childList: true, subtree: true });
})();
