const SUPABASE_URL = 'https://<https://fykogylrlwlqbgewbraf.';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5a29neWxybHdscWJnZXdicmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjUxMTYsImV4cCI6MjA2MzI0MTExNn0.xhBgxDooKS1vfxV_0c85r3cxeZmMp4_ZmMqPmfwz8Mg';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  if (error) {
    container.innerHTML = 'Błąd podczas pobierania artykułów.';
    return;
  }

  data.forEach(article => {
    const articleEl = document.createElement('div');
    articleEl.innerHTML = `
      <h3>${article.title}</h3>
      <h4>${article.subtitle}</h4>
      <p><strong>Autor:</strong> ${article.author}</p>
      <p><strong>Data:</strong> ${new Date(article.created_at).toLocaleString()}</p>
      <p>${article.content}</p>
      <hr>
    `;
    container.appendChild(articleEl);
  });
}

document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const subtitle = document.getElementById('subtitle').value;
  const author = document.getElementById('author').value;
  const content = document.getElementById('content').value;

  const { error } = await supabase.from('articles').insert([
    { title, subtitle, author, content }
  ]);

  if (error) {
    alert('Błąd przy dodawaniu artykułu.');
  } else {
    alert('Artykuł dodany!');
    e.target.reset();
    fetchArticles();
  }
});

fetchArticles();
