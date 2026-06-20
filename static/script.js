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

		// Pointer dragging (mouse/touch)
		let isDown = false;
		let startX, scrollLeft;

		track.addEventListener('pointerdown', (e) => {
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
	});
});
