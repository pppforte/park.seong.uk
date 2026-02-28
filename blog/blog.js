(function () {
  'use strict';

  var API_BASE = 'https://a94l76zovf.execute-api.ap-northeast-2.amazonaws.com/prod/blog';

  var listSection = document.getElementById('blog-list');
  var detailSection = document.getElementById('blog-detail');
  var postsContainer = document.getElementById('posts-container');
  var postContent = document.getElementById('post-content');
  var backBtn = document.getElementById('blog-back');
  var heroSection = document.querySelector('.blog-hero');

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '.' + m + '.' + day;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMarkdown(text) {
    // Simple markdown to HTML
    var html = escapeHtml(text);

    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Code blocks
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code class="lang-' + (lang || 'text') + '">' + code.trim() + '</code></pre>';
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold & italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1');
    html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');

    return html;
  }

  function renderPostCard(post) {
    var card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('role', 'article');
    card.style.cursor = 'pointer';

    var tagsHtml = '';
    if (post.tags && post.tags.length) {
      tagsHtml = '<div class="blog-card-tags">' +
        post.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') +
        '</div>';
    }

    card.innerHTML =
      '<div class="blog-card-meta">' +
        '<time datetime="' + post.createdAt + '">' + formatDate(post.createdAt) + '</time>' +
        '<span class="blog-card-tag">' + escapeHtml(post.category || '') + '</span>' +
      '</div>' +
      '<h2 class="blog-card-title">' + escapeHtml(post.title) + '</h2>' +
      '<p class="blog-card-excerpt">' + escapeHtml(post.excerpt) + '</p>' +
      tagsHtml;

    card.addEventListener('click', function () {
      loadPost(post.slug);
    });

    return card;
  }

  function showList() {
    listSection.style.display = '';
    detailSection.style.display = 'none';
    heroSection.style.display = '';
    window.history.pushState(null, '', '/blog/');
    document.title = '블로그 — 박성욱';
    window.scrollTo(0, 0);
  }

  function showDetail() {
    listSection.style.display = 'none';
    detailSection.style.display = '';
    heroSection.style.display = 'none';
    window.scrollTo(0, 0);
  }

  function loadPosts() {
    postsContainer.innerHTML = '<div class="blog-loading">글을 불러오는 중...</div>';

    fetch(API_BASE)
      .then(function (res) { return res.json(); })
      .then(function (posts) {
        postsContainer.innerHTML = '';

        if (!posts.length) {
          postsContainer.innerHTML = '<div class="blog-empty-hint"><p>아직 작성된 글이 없습니다.</p></div>';
          return;
        }

        posts.forEach(function (post) {
          postsContainer.appendChild(renderPostCard(post));
        });
      })
      .catch(function () {
        postsContainer.innerHTML = '<div class="blog-empty-hint"><p>글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p></div>';
      });
  }

  function loadPost(slug) {
    showDetail();
    postContent.innerHTML = '<div class="blog-loading">글을 불러오는 중...</div>';

    fetch(API_BASE + '/' + encodeURIComponent(slug))
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(function (post) {
        var tagsHtml = '';
        if (post.tags && post.tags.length) {
          tagsHtml = '<div class="blog-post-tags">' +
            post.tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('') +
            '</div>';
        }

        postContent.innerHTML =
          '<div class="blog-post-meta">' +
            '<time datetime="' + post.createdAt + '">' + formatDate(post.createdAt) + '</time>' +
            '<span class="blog-card-tag">' + escapeHtml(post.category || '') + '</span>' +
            '<span class="blog-post-views">' + (post.views || 0) + '회 읽음</span>' +
          '</div>' +
          '<h1 class="blog-post-title">' + escapeHtml(post.title) + '</h1>' +
          tagsHtml +
          '<div class="blog-post-body">' + renderMarkdown(post.content) + '</div>';

        window.history.pushState(null, '', '/blog/#' + slug);
        document.title = post.title + ' — 박성욱';
      })
      .catch(function () {
        postContent.innerHTML = '<div class="blog-empty-hint"><p>글을 찾을 수 없습니다.</p></div>';
      });
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', showList);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function () {
    var hash = window.location.hash.slice(1);
    if (hash) {
      loadPost(hash);
    } else {
      listSection.style.display = '';
      detailSection.style.display = 'none';
      heroSection.style.display = '';
    }
  });

  // Initial load
  var initialSlug = window.location.hash.slice(1);
  if (initialSlug) {
    loadPost(initialSlug);
  }
  loadPosts();
})();
