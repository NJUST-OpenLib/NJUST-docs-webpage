// Light / Dark theme toggle
(function () {
  const defaultTheme = 'system'

  const themeToggleButtons = document.querySelectorAll(".theme-toggle");

  // Change the icons of the buttons based on previous settings or system theme
  if (
    sessionStorage.getItem("color-theme") === "dark" ||
    (!(sessionStorage.getItem("color-theme")) &&
      ((window.matchMedia("(prefers-color-scheme: dark)").matches && defaultTheme === "system") || defaultTheme === "dark"))
  ) {
    themeToggleButtons.forEach((el) => el.dataset.theme = "dark");
  } else {
    themeToggleButtons.forEach((el) => el.dataset.theme = "light");
  }

  // Add click event handler to the buttons
  themeToggleButtons.forEach((el) => {
    el.addEventListener("click", function () {
      if (sessionStorage.getItem("color-theme")) {
        if (sessionStorage.getItem("color-theme") === "light") {
          setDarkTheme();
          sessionStorage.setItem("color-theme", "dark");
        } else {
          setLightTheme();
          sessionStorage.setItem("color-theme", "light");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          setLightTheme();
          sessionStorage.setItem("color-theme", "light");
        } else {
          setDarkTheme();
          sessionStorage.setItem("color-theme", "dark");
        }
      }
      el.dataset.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    });
  });

  // Listen for system theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (defaultTheme === "system" && !("color-theme" in sessionStorage)) {
      e.matches ? setDarkTheme() : setLightTheme();
      themeToggleButtons.forEach((el) =>
        el.dataset.theme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    }
  });
})();

;
// Hamburger menu for mobile navigation

document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('.hamburger-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const sidebarContainer = document.querySelector('.sidebar-container');

  // Initialize the overlay
  const overlayClasses = ['hx-fixed', 'hx-inset-0', 'hx-z-10', 'hx-bg-black/80', 'dark:hx-bg-black/60'];
  overlay.classList.add('hx-bg-transparent');
  overlay.classList.remove("hx-hidden", ...overlayClasses);

  function toggleMenu() {
    // Toggle the hamburger menu
    menu.querySelector('svg').classList.toggle('open');

    // When the menu is open, we want to show the navigation sidebar
    sidebarContainer.classList.toggle('max-md:[transform:translate3d(0,-100%,0)]');
    sidebarContainer.classList.toggle('max-md:[transform:translate3d(0,0,0)]');

    // When the menu is open, we want to prevent the body from scrolling
    document.body.classList.toggle('hx-overflow-hidden');
    document.body.classList.toggle('md:hx-overflow-auto');
  }

  menu.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();

    if (overlay.classList.contains('hx-bg-transparent')) {
      // Show the overlay
      overlay.classList.add(...overlayClasses);
      overlay.classList.remove('hx-bg-transparent');
    } else {
      // Hide the overlay
      overlay.classList.remove(...overlayClasses);
      overlay.classList.add('hx-bg-transparent');
    }
  });

  overlay.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();

    // Hide the overlay
    overlay.classList.remove(...overlayClasses);
    overlay.classList.add('hx-bg-transparent');
  });
});

;
// Copy button for code blocks

document.addEventListener('DOMContentLoaded', function () {
  const getCopyIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    `;
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    return svg;
  }

  const getSuccessIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    `;
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    return svg;
  }

  document.querySelectorAll('.hextra-code-copy-btn').forEach(function (button) {
    // Add copy and success icons
    button.querySelector('.copy-icon')?.appendChild(getCopyIcon());
    button.querySelector('.success-icon')?.appendChild(getSuccessIcon());

    // Add click event listener for copy button
    button.addEventListener('click', function (e) {
      e.preventDefault();
      // Get the code target
      const target = button.parentElement.previousElementSibling;
      let codeElement;
      if (target.tagName === 'CODE') {
        codeElement = target;
      } else {
        // Select the last code element in case line numbers are present
        const codeElements = target.querySelectorAll('code');
        codeElement = codeElements[codeElements.length - 1];
      }
      if (codeElement) {
        let code = codeElement.innerText;
        // Replace double newlines with single newlines in the innerText
        // as each line inside <span> has trailing newline '\n'
        if ("lang" in codeElement.dataset) {
          code = code.replace(/\n\n/g, '\n');
        }
        navigator.clipboard.writeText(code).then(function () {
          button.classList.add('copied');
          setTimeout(function () {
            button.classList.remove('copied');
          }, 1000);
        }).catch(function (err) {
          console.error('Failed to copy text: ', err);
        });
      } else {
        console.error('Target element not found');
      }
    });
  });
});

;
document.querySelectorAll('.hextra-tabs-toggle').forEach(function (button) {
  button.addEventListener('click', function (e) {
    // set parent tabs to unselected
    const tabs = Array.from(e.target.parentElement.querySelectorAll('.hextra-tabs-toggle'));
    tabs.map(tab => tab.dataset.state = '');

    // set current tab to selected
    e.target.dataset.state = 'selected';

    // set all panels to unselected
    const panelsContainer = e.target.parentElement.parentElement.nextElementSibling;
    Array.from(panelsContainer.children).forEach(function (panel) {
      panel.dataset.state = '';
    });

    const panelId = e.target.getAttribute('aria-controls');
    const panel = panelsContainer.querySelector(`#${panelId}`);
    panel.dataset.state = 'selected';
  });
});

;
(function () {
  const languageSwitchers = document.querySelectorAll('.language-switcher');
  languageSwitchers.forEach((switcher) => {
    switcher.addEventListener('click', (e) => {
      e.preventDefault();
      switcher.dataset.state = switcher.dataset.state === 'open' ? 'closed' : 'open';
      const optionsElement = switcher.nextElementSibling;
      optionsElement.classList.toggle('hx-hidden');

      // Calculate position of language options element
      const switcherRect = switcher.getBoundingClientRect();
      const translateY = switcherRect.top - window.innerHeight - 15;
      optionsElement.style.transform = `translate3d(${switcherRect.left}px, ${translateY}px, 0)`;
      optionsElement.style.minWidth = `${Math.max(switcherRect.width, 50)}px`;
    });
  });

  // Dismiss language switcher when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.closest('.language-switcher') === null) {
      languageSwitchers.forEach((switcher) => {
        switcher.dataset.state = 'closed';
        const optionsElement = switcher.nextElementSibling;
        optionsElement.classList.add('hx-hidden');
      });
    }
  });
})();

;
document.addEventListener("DOMContentLoaded", function () {
  scrollToActiveItem();
  enableCollapsibles();
});

function enableCollapsibles() {
  const buttons = document.querySelectorAll(".hextra-sidebar-collapsible-button");
  buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const list = button.parentElement.parentElement;
      if (list) {
        list.classList.toggle("open")
      }
    });
  });
}

function scrollToActiveItem() {
  const sidebarScrollbar = document.querySelector("aside.sidebar-container > .hextra-scrollbar");
  const activeItems = document.querySelectorAll(".sidebar-active-item");
  const visibleActiveItem = Array.from(activeItems).find(function (activeItem) {
    return activeItem.getBoundingClientRect().height > 0;
  });

  if (!visibleActiveItem) {
    return;
  }

  const yOffset = visibleActiveItem.clientHeight;
  const yDistance = visibleActiveItem.getBoundingClientRect().top - sidebarScrollbar.getBoundingClientRect().top;
  sidebarScrollbar.scrollTo({
    behavior: "instant",
    top: yDistance - yOffset
  });
}

;
// Back to top button

document.addEventListener("DOMContentLoaded", function () {
  const backToTop = document.querySelector("#backToTop");
  if (backToTop) {
    document.addEventListener("scroll", (e) => {
      if (window.scrollY > 300) {
        backToTop.classList.remove("hx-opacity-0");
      } else {
        backToTop.classList.add("hx-opacity-0");
      }
    });
  }
});

function scrollUp() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

;
document.addEventListener("DOMContentLoaded", function() {
    // 获取所有需要检测的链接元素
    const linkElements = document.querySelectorAll('.hoa-friend-link');

    const checkAllNetworks = async () => {
        const networkChecks = Array.from(linkElements).map(linkElement => {
            const networkPoint = linkElement.querySelector('.hoa-network-point');
            const link = linkElement.dataset.link;
            
            if (!networkPoint || !link) return Promise.resolve();
            
            return (async () => {
                // 初始状态移除所有背景色
                networkPoint.classList.remove('hx-bg-green-500', 'hx-bg-yellow-500', 'hx-bg-red-500');
                
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 4000);
                    
                    const startTime = Date.now();
                    
                    const response = await Promise.race([
                        fetch(link, {
                            method: 'HEAD',
                            signal: controller.signal,
                            mode: 'no-cors'
                        }).then(response => {
                            // console.log(`${link}: ${response.headers}`);
                        }),
                        new Promise((_, reject) => {
                            setTimeout(() => reject(new Error('Timeout')), 4000);
                        })
                    ]);
                    
                    clearTimeout(timeoutId);
                    const responseTime = Date.now() - startTime;
                    
                    // 根据响应时间添加对应的类
                    if (responseTime <= 2000) {
                        networkPoint.classList.add('hx-bg-green-500');
                    } else if (responseTime < 4000) {
                        networkPoint.classList.add('hx-bg-yellow-500');
                    }
                } catch (error) {
                    // 发生错误或超时时添加红色类名
                    networkPoint.classList.add('hx-bg-red-500');
                }
            })();
        });
    
        // 等待所有网络检查完成
        await Promise.all(networkChecks);
    };
        
    // 立即执行检查
    checkAllNetworks();
    
    // 每1h检查一次
    // setInterval(checkNetworkStatus, 3600000);
});