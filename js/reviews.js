document.addEventListener('DOMContentLoaded', function () {
	var basePath = 'my_images/reviews/';
	var maxScan = 16; // scans 1.jpg .. 50.jpg
	var initiallyVisible = 5;
	var container = document.getElementById('reviewsImages');
	if (!container) return;
	var toggleBtn = document.getElementById('reviewsToggleBtn');
	var showAll = false;

	function appendImage(url) {
		var item = document.createElement('div');
		item.className = 'review_item';
		var img = document.createElement('img');
		img.src = url;
		img.alt = 'Відгук';
		item.appendChild(img);
		container.appendChild(item);
	}

	function updateVisibility() {
		var items = container.querySelectorAll('.review_item');
		for (var i = 0; i < items.length; i++) {
			if (!showAll && i >= initiallyVisible) {
				items[i].style.display = 'none';
			} else {
				items[i].style.display = '';
			}
		}
		if (toggleBtn) {
			toggleBtn.textContent = showAll ? 'Сховати' : 'Завантажити всі відгуки';
			if (toggleBtn.classList) {
				toggleBtn.classList.toggle('is-fixed', showAll);
			}
		}
	}

	function tryLoad(index) {
		var url = basePath + index + '.jpg';
		var testImg = new Image();
		testImg.onload = function () {
			appendImage(url);
			updateVisibility();
		};
		testImg.onerror = function () { };
		testImg.src = url;
	}

	for (var i = 1; i <= maxScan; i++) {
		tryLoad(i);
	}

	if (toggleBtn) {
		toggleBtn.addEventListener('click', function () {
			showAll = !showAll;
			updateVisibility();
		});
	}
});

