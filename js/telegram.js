// Simple Telegram sender for the order form
(function () {
	var form = document.getElementById('order_form');
	if (!form) return;

	// Configure your Telegram bot token and chat id here
	// Example: const TELEGRAM_BOT_TOKEN = '123456:ABC...'; const TELEGRAM_CHAT_ID = '-1001234567890';
	var TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
	var TELEGRAM_CHAT_ID = process.env.MY_SECRET.TELEGRAM_CHAT_ID;

	function buildMessage(data) {
		var lines = [];
		lines.push('🧵 Нове замовлення (вишиванка)');
		lines.push('');
		lines.push('Товар: ' + (data.product || '-'));
		lines.push('Розмір/груди/вік: ' + (data.size_info || '-'));
		lines.push('Адреса: ' + (data.address || '-'));
		lines.push('ПІБ: ' + (data.user_name || '-'));
		lines.push('Телефон: ' + (data.user_phone || '-'));
		if (data.extra) {
			lines.push('Додатково: ' + data.extra);
		}
		return lines.join('\n');
	}

	async function sendToTelegram(text) {
		if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
			alert('Налаштуйте TELEGRAM_BOT_TOKEN та TELEGRAM_CHAT_ID у js/telegram.js');
			throw new Error('Missing Telegram config');
		}
		var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
		var res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: TELEGRAM_CHAT_ID,
				text: text
			})
		});
		if (!res.ok) {
			var t = await res.text().catch(function(){ return ''; });
			throw new Error('Telegram error: ' + res.status + ' ' + t);
		}
		return res.json();
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var fd = new FormData(form);
		var data = {
			product: fd.get('product'),
			size_info: fd.get('size_info'),
			address: fd.get('address'),
			user_name: fd.get('user_name'),
			user_phone: fd.get('user_phone'),
			extra: fd.get('extra')
		};
		var message = buildMessage(data);
		sendToTelegram(message)
			.then(function () {
				alert('Дякуємо! Замовлення відправлено. Ми скоро зателефонуємо.');
				form.reset();
			})
			.catch(function (err) {
				console.error(err);
				alert('Сталася помилка під час відправки. Спробуйте ще раз або зателефонуйте нам.');
			});
	});
})();

