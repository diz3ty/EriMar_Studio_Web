document.addEventListener('DOMContentLoaded', function () {
	// Initialize sliders: buttons and pointer dragging
	document.querySelectorAll('.cards-slider').forEach((container) => {
		const track = container.querySelector('.slider-track');
		const btnPrev = container.querySelector('.slider-btn.prev');
		const btnNext = container.querySelector('.slider-btn.next');

		if (!track) return;

		// Button scrolling
		const scrollAmount = () => Math.round(track.clientWidth * 0.8);
		if (btnPrev) btnPrev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
		if (btnNext) btnNext.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

		// Hover auto-scroll: start continuous scroll while pointer is over button
		let hoverAnim = null;
		let hoverDir = 0; // -1 left, +1 right
		let hoverLastTs = null;
		const HOVER_SPEED = 500; // pixels per second (adjustable)

		function hoverStep(ts) {
			if (!hoverLastTs) hoverLastTs = ts;
			const dt = (ts - hoverLastTs) / 1000; // seconds
			hoverLastTs = ts;
			track.scrollLeft += hoverDir * HOVER_SPEED * dt;
			hoverAnim = requestAnimationFrame(hoverStep);
		}

		function startHover(dir) {
			if (hoverAnim) return; // already scrolling
			hoverDir = dir;
			hoverLastTs = null;
			hoverAnim = requestAnimationFrame(hoverStep);
		}

		function stopHover() {
			if (hoverAnim) cancelAnimationFrame(hoverAnim);
			hoverAnim = null;
			hoverLastTs = null;
		}

		if (btnPrev) {
			// pointer events
			btnPrev.addEventListener('pointerenter', () => startHover(-1));
			btnPrev.addEventListener('pointerleave', () => stopHover());
			btnPrev.addEventListener('pointerdown', () => stopHover());
			// mouse fallback
			btnPrev.addEventListener('mouseenter', () => startHover(-1));
			btnPrev.addEventListener('mouseleave', () => stopHover());
			// touch fallback
			btnPrev.addEventListener('touchstart', (e) => { e.preventDefault(); startHover(-1); });
			btnPrev.addEventListener('touchend', () => stopHover());
		}
		if (btnNext) {
			btnNext.addEventListener('pointerenter', () => startHover(1));
			btnNext.addEventListener('pointerleave', () => stopHover());
			btnNext.addEventListener('pointerdown', () => stopHover());
			btnNext.addEventListener('mouseenter', () => startHover(1));
			btnNext.addEventListener('mouseleave', () => stopHover());
			btnNext.addEventListener('touchstart', (e) => { e.preventDefault(); startHover(1); });
			btnNext.addEventListener('touchend', () => stopHover());
		}

		// Pointer dragging (mouse/touch)
		let isDown = false;
		let startX, scrollLeft;

		track.addEventListener('pointerdown', (e) => {
			if (e.target.closest('a, button, input, textarea, select, [role="button"]')) return;
			isDown = true;
			track.setPointerCapture(e.pointerId);
			startX = e.clientX;
			scrollLeft = track.scrollLeft;
			track.classList.add('dragging');
		});

		track.addEventListener('pointermove', (e) => {
			if (!isDown) return;
			const dx = e.clientX - startX;
			track.scrollLeft = scrollLeft - dx;
		});

		const stopDrag = (e) => {
			if (!isDown) return;
			isDown = false;
			try { track.releasePointerCapture(e.pointerId); } catch (err) {}
			track.classList.remove('dragging');
		};
		track.addEventListener('pointerup', stopDrag);
		track.addEventListener('pointercancel', stopDrag);
		track.addEventListener('pointerleave', stopDrag);

		// Create fixed overlay arrow buttons (appended to body) so they are always on top
		try {
			const prevFixed = document.createElement('button');
			prevFixed.className = 'slider-btn-fixed left';
			prevFixed.innerHTML = '‹';
			document.body.appendChild(prevFixed);
			const nextFixed = document.createElement('button');
			nextFixed.className = 'slider-btn-fixed right';
			nextFixed.innerHTML = '›';
			document.body.appendChild(nextFixed);

			// Bind click to scroll track
			prevFixed.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
			nextFixed.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

			// Bind hover auto-scroll using the same startHover/stopHover
			prevFixed.addEventListener('pointerenter', () => startHover(-1));
			prevFixed.addEventListener('pointerleave', () => stopHover());
			prevFixed.addEventListener('pointerdown', () => stopHover());
			prevFixed.addEventListener('mouseenter', () => startHover(-1));
			prevFixed.addEventListener('mouseleave', () => stopHover());
			prevFixed.addEventListener('touchstart', (e) => { e.preventDefault(); startHover(-1); });
			prevFixed.addEventListener('touchend', () => stopHover());

			nextFixed.addEventListener('pointerenter', () => startHover(1));
			nextFixed.addEventListener('pointerleave', () => stopHover());
			nextFixed.addEventListener('pointerdown', () => stopHover());
			nextFixed.addEventListener('mouseenter', () => startHover(1));
			nextFixed.addEventListener('mouseleave', () => stopHover());
			nextFixed.addEventListener('touchstart', (e) => { e.preventDefault(); startHover(1); });
			nextFixed.addEventListener('touchend', () => stopHover());

			// Position function
			const updateFixedPos = () => {
				const rect = container.getBoundingClientRect();
				const isVisible = rect.width > 0 && rect.height > 0;
				prevFixed.style.display = isVisible ? 'flex' : 'none';
				nextFixed.style.display = isVisible ? 'flex' : 'none';
				if (!isVisible) return;

				const y = rect.top + rect.height / 2;
				// keep within viewport bounds
				const top = Math.max(40, Math.min(window.innerHeight - 40, y));
				prevFixed.style.top = `${top}px`;
				nextFixed.style.top = `${top}px`;
			};

			updateFixedPos();
			window.addEventListener('resize', updateFixedPos);
			window.addEventListener('scroll', updateFixedPos, { passive: true });
			window.addEventListener('site-view-change', updateFixedPos);
		} catch (err) {
			console.warn('Could not create fixed slider buttons', err);
		}
	});

	const viewElements = new Map([
		['home', document.getElementById('home-view')],
		['services', document.getElementById('services-view')],
		['promos', document.getElementById('promos-view')],
		['courses', document.getElementById('courses-view')],
		['policies', document.getElementById('policies-view')],
		['contact', document.getElementById('contact-view')],
	]);
	const availableViews = new Map([...viewElements].filter(([, element]) => element));
	const viewLinks = document.querySelectorAll('[data-view-toggle]');

	if (availableViews.size && viewLinks.length) {
		const setActiveView = (activeView, addHistory = false) => {
			for (const [name, element] of availableViews) {
				element.hidden = name !== activeView;
			}

			if (addHistory) {
				const target = activeView === 'home'
					? `${location.pathname}${location.search}`
					: `#${activeView}-view`;
				history.pushState(null, '', target);
			}

			window.dispatchEvent(new Event('site-view-change'));
		};

		viewLinks.forEach((link) => {
			const viewName = link.dataset.viewToggle;
			if (!availableViews.has(viewName)) return;

			link.addEventListener('click', (event) => {
				event.preventDefault();
				setActiveView(viewName, true);
			});
		});

		const syncActiveView = () => {
			const hash = location.hash.slice(1);
			const viewName = [...availableViews.keys()].find((name) => hash === `${name}-view`) || 'home';
			setActiveView(viewName);
		};

		window.addEventListener('popstate', syncActiveView);
		window.addEventListener('hashchange', syncActiveView);
		syncActiveView();
	}

	// Hamburger menu toggle
	function initHamburgers() {
		document.querySelectorAll('.hamburger').forEach((btn) => {
			const nav = btn.closest('nav');
			btn.addEventListener('click', () => {
				nav.classList.toggle('nav-open');
				const opened = nav.classList.contains('nav-open');
				btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
			});
		});
	}

	initHamburgers();

	// On mobile, the first tap opens the Services submenu instead of navigating.
	document.querySelectorAll('.menu-services > a').forEach((link) => {
		link.addEventListener('click', (event) => {
			if (link.hasAttribute('data-view-toggle')) return;
			if (!link.nextElementSibling?.classList.contains('submenu')) return;
			if (window.innerWidth > 900) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			const menu = link.parentElement;
			const isOpen = menu.classList.contains('submenu-open');
			document.querySelectorAll('.menu-services.submenu-open').forEach((item) => {
				item.classList.remove('submenu-open');
			});
			if (!isOpen) menu.classList.add('submenu-open');
		}, true);
	});

	// Close hamburger nav when resizing to wide screens
	window.addEventListener('resize', () => {
		if (window.innerWidth > 900) {
			document.querySelectorAll('.navbar.nav-open').forEach(n => n.classList.remove('nav-open'));
			document.querySelectorAll('.hamburger').forEach(b => b.setAttribute('aria-expanded','false'));
		}
	});
});
