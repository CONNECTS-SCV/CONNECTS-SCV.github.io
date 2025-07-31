source "https://rubygems.org"

# ✅ Jekyll 명시적으로 버전 고정 (안정성 위해)
gem "jekyll", "~> 4.2.2"

# ✅ ffi 충돌 방지: Apple Silicon + Ruby 2.7 호환 버전
gem "ffi", ">= 1.15.5"

# ✅ Jekyll 관련 플러그인
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-relative-links"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
end

# ✅ Windows 환경용 설정 (macOS에서는 무시됨)
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

