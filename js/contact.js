document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const message = form.querySelector('#message');

  function setError(field, message) {
    const p = form.querySelector(`.error[data-for="${field.id}"]`);
    if (p) p.textContent = message || '';
  }

  function validateEmail(value) {
    return /.+@.+\..+/.test(value);
  }

  form.addEventListener('submit', function(e) {
    let valid = true;

    if (!name.value.trim()) {
      setError(name, 'お名前を入力してください');
      valid = false;
    } else {
      setError(name, '');
    }

    if (!email.value.trim()) {
      setError(email, 'メールアドレスを入力してください');
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      setError(email, '正しいメールアドレスを入力してください');
      valid = false;
    } else {
      setError(email, '');
    }

    if (!message.value.trim()) {
      setError(message, 'お問い合わせ内容を入力してください');
      valid = false;
    } else {
      setError(message, '');
    }

    if (!valid) {
      e.preventDefault();
      return;
    }

    // 仮送信処理（実運用ではバックエンドに送信）
    e.preventDefault();
    form.reset();
    alert('送信しました。ご連絡ありがとうございます。');
  });
});
