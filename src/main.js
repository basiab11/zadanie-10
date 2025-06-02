import { format } from 'date-fns';

const API_URL = 'https://fykogylrlwlqbgewbraf.supabase.co/rest/v1/article';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a29neWxybHdscWJnZXdicmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjUxMTYsImV4cCI6MjA2MzI0MTExNn0.xhBgxDooKS1vfxV_0c85r3cxeZmMp4_ZmMqPmfwz8Mg';

async function loadArticles(orderBy = 'created_at.asc') {
  try {
    const response = await fetch(`${API_URL}?order=${orderBy}`, {
      method: 'GET',
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Błąd HTTP');

    const data = await response.json();
    displayArticles(data);
  } catch (error) {
    console.error('Błąd:', error);
    document.getElementById('articles-container').innerText =
      'Wystąpił błąd podczas ładowania artykułów: ' + error.message;
  }
}

function displayArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(article => {
    const div = document.createElement('div');
    div.className = 'article-box';

    div.innerHTML = `
      <h2>${article.title}</h2>
      <h3>${article.subtitle}</h3>
      <p><strong>Autor:</strong> ${article.author}</p>
      <p><strong>Data:</strong> ${format(new Date(article.created_at), 'dd-MM-yyyy')}</p>
      <p>${article.content}</p>
    `;

    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadArticles();

  const form = document.getElementById('article-form');
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          subtitle,
          author,
          content,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Błąd przy dodawaniu artykułu');

      await loadArticles();
      form.reset();
    } catch (error) {
      console.error('Błąd dodawania artykułu:', error);
    }
  });
});
