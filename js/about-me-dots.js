const svgNamespace = 'http://www.w3.org/2000/svg';
let resizeObserver;
let observedContainer;
let animationEndHandler;
let windowResizeHandler;

function positionDots(container, dots) {
	const containerBounds = container.getBoundingClientRect();
	const width = container.clientWidth;
	const positions = [...dots].map(dot => {
		const bounds = dot.getBoundingClientRect();

		return {
			x: bounds.left - containerBounds.left - container.clientLeft + container.scrollLeft + bounds.width / 2,
			y: bounds.top - containerBounds.top - container.clientTop + container.scrollTop + bounds.height / 2,
			bottom: bounds.bottom - containerBounds.top - container.clientTop + container.scrollTop
		};
	});
	const height = Math.max(container.clientHeight, ...positions.map(position => position.bottom), 1);
	const lineLayer = document.createElementNS(svgNamespace, 'svg');
	lineLayer.classList.add('about-me-dots-lines');
	lineLayer.setAttribute('viewBox', `0 0 ${Math.max(width, 1)} ${height}`);
	lineLayer.setAttribute('aria-hidden', 'true');
	lineLayer.style.position = 'absolute';
	lineLayer.style.top = '0';
	lineLayer.style.left = '0';
	lineLayer.style.width = '100%';
	lineLayer.style.height = `${height}px`;
	lineLayer.style.overflow = 'visible';
	lineLayer.style.pointerEvents = 'none';
	container.querySelector('.about-me-dots-lines')?.remove();
	container.prepend(lineLayer);

	positions.slice(1).forEach((position, index) => {
		const previousPosition = positions[index];
		const beforePrevious = positions[Math.max(index - 1, 0)];
		const afterPosition = positions[Math.min(index + 2, positions.length - 1)];
		const control1 = {
			x: previousPosition.x + (position.x - beforePrevious.x) / 6,
			y: previousPosition.y + (position.y - beforePrevious.y) / 6
		};
		const control2 = {
			x: position.x - (afterPosition.x - previousPosition.x) / 6,
			y: position.y - (afterPosition.y - previousPosition.y) / 6
		};
		const curve = document.createElementNS(svgNamespace, 'path');
		curve.setAttribute(
			'd',
			`M ${previousPosition.x} ${previousPosition.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${position.x} ${position.y}`
		);
		curve.setAttribute('fill', 'none');
		curve.setAttribute('stroke', 'blueviolet');
		curve.setAttribute('stroke-width', '2');
		curve.setAttribute('stroke-dasharray', '4 6');
		curve.setAttribute('stroke-linecap', 'round');
		curve.setAttribute('opacity', '0.8');
		lineLayer.appendChild(curve);
	});
}

export function initializeAboutMeDots() {
	const container = document.getElementById('about-me-container');
	if (!container) {
		throw new Error('About Me dot container was not found.');
	}

	const paragraphs = [...container.querySelectorAll(':scope > p')];
	const dots = paragraphs.map(paragraph => paragraph.querySelector('.dot'));
	if (dots.some(dot => !dot)) {
		throw new Error('Every About Me paragraph must contain a dot.');
	}

	destroyAboutMeDots();
	dots.forEach((dot, index) => {
		dot.classList.add('about-me-dot-overlay');
		dot.style.position = 'absolute';
		dot.style.left = [1, 2, 5].includes(index) ? '100%' : '0';
		dot.style.right = 'auto';
		dot.style.top = '50%';
		dot.style.transform = 'translate(-50%, -50%)';
		dot.style.pointerEvents = 'none';
	});
	positionDots(container, dots);

	resizeObserver = new ResizeObserver(() => positionDots(container, dots));
	resizeObserver.observe(container);
	paragraphs.forEach(paragraph => resizeObserver.observe(paragraph));
	animationEndHandler = event => {
		if (event.target.tagName === 'P' && event.target.parentElement === container) {
			positionDots(container, dots);
		}
	};
	container.addEventListener('animationend', animationEndHandler);
	const paragraphAnimations = paragraphs
		.flatMap(paragraph => paragraph.getAnimations())
		.filter(animation => animation.animationName === 'fade-anim');
	Promise.allSettled(paragraphAnimations.map(animation => animation.finished)).then(() => {
		if (container.isConnected) {
			positionDots(container, dots);
		}
	});
	windowResizeHandler = () => positionDots(container, dots);
	window.addEventListener('resize', windowResizeHandler);
	observedContainer = container;
}

export function destroyAboutMeDots() {
	resizeObserver?.disconnect();
	resizeObserver = undefined;
	if (observedContainer && animationEndHandler) {
		observedContainer.removeEventListener('animationend', animationEndHandler);
	}
	if (windowResizeHandler) {
		window.removeEventListener('resize', windowResizeHandler);
	}
	observedContainer = undefined;
	animationEndHandler = undefined;
	windowResizeHandler = undefined;
}
