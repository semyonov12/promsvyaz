document.addEventListener("DOMContentLoaded", function (event) {


	// бургер меню
	let burger = document.querySelector(".burger-menu");
	let documentBody = document.documentElement;

	function menuOpen() {
		documentBody.classList.toggle("lock");
		documentBody.classList.toggle("menu-open");
	};

	function menuClose() {
		documentBody.classList.remove("menu-open");
		documentBody.classList.remove("lock");
	};

	burger.addEventListener("click", function () {
		menuOpen();
	});

	/* Проверка мобильного браузера */
	let isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

	// Добавление класса _touch для HTML если браузер мобильный
	if (isMobile.any()) document.documentElement.classList.add('touch');

	// Выпадающие меню
	document.addEventListener("click", function (e) {
		const targetElement = e.target;

		if (window.innerWidth > 992 && document.documentElement.classList.contains('touch')) {
			if (targetElement.closest('.menu__wrap')) {
				targetElement.closest('.menu__item').classList.toggle('hover');
			}
			if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item.hover').length) {
				document.querySelectorAll('.menu__item.hover').forEach(element => {
					element.classList.remove('hover');
				});
			}
		}
	});

	// споллеры
	// Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
	let _slideUp = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = `${target.offsetHeight}px`;
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = !showmore ? true : false;
				!showmore ? target.style.removeProperty('height') : null;
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				!showmore ? target.style.removeProperty('overflow') : null;
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
				// Создаем событие 
				document.dispatchEvent(new CustomEvent("slideUpDone", {
					detail: {
						target: target
					}
				}));
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.hidden = target.hidden ? false : null;
			showmore ? target.style.removeProperty('height') : null;
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
				// Создаем событие 
				document.dispatchEvent(new CustomEvent("slideDownDone", {
					detail: {
						target: target
					}
				}));
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}

	// Обработа медиа запросов из атрибутов 
	function dataMediaQueries(array, dataSetValue) {
		// Получение объектов с медиа запросами
		const media = Array.from(array).filter(function (item, index, self) {
			if (item.dataset[dataSetValue]) {
				return item.dataset[dataSetValue].split(",")[0];
			}
		});
		// Инициализация объектов с медиа запросами
		if (media.length) {
			const breakpointsArray = [];
			media.forEach(item => {
				const params = item.dataset[dataSetValue];
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});
			// Получаем уникальные брейкпоинты
			let mdQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mdQueries = uniqArray(mdQueries);
			const mdQueriesArray = [];

			if (mdQueries.length) {
				// Работаем с каждым брейкпоинтом
				mdQueries.forEach(breakpoint => {
					const paramsArray = breakpoint.split(",");
					const mediaBreakpoint = paramsArray[1];
					const mediaType = paramsArray[2];
					const matchMedia = window.matchMedia(paramsArray[0]);
					// Объекты с нужными условиями
					const itemsArray = breakpointsArray.filter(function (item) {
						if (item.value === mediaBreakpoint && item.type === mediaType) {
							return true;
						}
					});
					mdQueriesArray.push({
						itemsArray,
						matchMedia
					})
				});
				return mdQueriesArray;
			}
		}
	}

	// Уникализация массива
	function uniqArray(array) {
		return array.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});
	}

	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
						spollerClose.classList.remove('_spoller-active');
						_slideUp(spollerClose.nextElementSibling, spollerSpeed);
					});
				}
			});
		}
	}

	// маска
	let inputs = document.querySelectorAll('input[type="tel"]');
	if (inputs.length) {
		let im = new Inputmask('+7 (999) - 999-99-99');
		im.mask(inputs);
	}

	//////////////ТАБЫ

	// Получение хеша в адресе сайта
	function getHash() {
		if (location.hash) { return location.hash.replace('#', ''); }
	}

	function tabs() {
		const tabs = document.querySelectorAll('[data-tabs]');
		let tabsActiveHash = [];

		if (tabs.length > 0) {
			const hash = getHash();
			if (hash && hash.startsWith('tab-')) {
				tabsActiveHash = hash.replace('tab-', '').split('-');
			}
			tabs.forEach((tabsBlock, index) => {
				tabsBlock.classList.add('_tab-init');
				tabsBlock.setAttribute('data-tabs-index', index);
				tabsBlock.addEventListener("click", setTabsAction);
				initTabs(tabsBlock);
			});

			// Получение слойлеров с медиа запросами
			let mdQueriesArray = dataMediaQueries(tabs, "tabs");
			if (mdQueriesArray && mdQueriesArray.length) {
				mdQueriesArray.forEach(mdQueriesItem => {
					// Событие
					mdQueriesItem.matchMedia.addEventListener("change", function () {
						setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
					});
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
			}
		}
		// Установка позиций заголовков
		function setTitlePosition(tabsMediaArray, matchMedia) {
			tabsMediaArray.forEach(tabsMediaItem => {
				tabsMediaItem = tabsMediaItem.item;
				let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
				let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
				let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
				let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
				tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
				tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
				tabsContentItems.forEach((tabsContentItem, index) => {
					if (matchMedia.matches) {
						tabsContent.append(tabsTitleItems[index]);
						tabsContent.append(tabsContentItem);
						tabsMediaItem.classList.add('_tab-spoller');
					} else {
						tabsTitles.append(tabsTitleItems[index]);
						tabsMediaItem.classList.remove('_tab-spoller');
					}
				});
			});
		}
		// Работа с контентом
		function initTabs(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
			let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

			if (tabsActiveHashBlock) {
				const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
				tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
			}
			if (tabsContent.length) {
				tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
				tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
				tabsContent.forEach((tabsContentItem, index) => {
					tabsTitles[index].setAttribute('data-tabs-title', '');
					tabsContentItem.setAttribute('data-tabs-item', '');

					if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
						tabsTitles[index].classList.add('_tab-active');
					}
					tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
				});
			}
		}
		function setTabsStatus(tabsBlock) {
			let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
			let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
			const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
			function isTabsAnamate(tabsBlock) {
				if (tabsBlock.hasAttribute('data-tabs-animate')) {
					return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
				}
			}
			const tabsBlockAnimate = isTabsAnamate(tabsBlock);
			if (tabsContent.length > 0) {
				const isHash = tabsBlock.hasAttribute('data-tabs-hash');
				tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
				tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
				tabsContent.forEach((tabsContentItem, index) => {
					if (tabsTitles[index].classList.contains('_tab-active')) {
						if (tabsBlockAnimate) {
							_slideDown(tabsContentItem, tabsBlockAnimate);
						} else {
							tabsContentItem.hidden = false;
						}
						if (isHash && !tabsContentItem.closest('.popup')) {
							setHash(`tab-${tabsBlockIndex}-${index}`);
						}
					} else {
						if (tabsBlockAnimate) {
							_slideUp(tabsContentItem, tabsBlockAnimate);
						} else {
							tabsContentItem.hidden = true;
						}
					}
				});
			}
		}
		function setTabsAction(e) {
			const el = e.target;
			if (el.closest('[data-tabs-title]')) {
				const tabTitle = el.closest('[data-tabs-title]');
				const tabsBlock = tabTitle.closest('[data-tabs]');
				if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
					let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
					tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
					tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
					tabTitle.classList.add('_tab-active');
					setTabsStatus(tabsBlock);
				}
				e.preventDefault();
			}
		}
	}

	tabs();


});



