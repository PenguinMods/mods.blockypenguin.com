{% assign redirect_clarifier = page.name | remove: '.md' | capitalize %}
{% if redirect_clarifier == 'Index' %}
  {% assign redirect_clarifier = 'Home' %}
{% endif %}

# Zwish (Fabric)
## {{redirect_clarifier}}

If you do not get redirected soon, click [here](https://www.modrinth.com/mod/zwish)

<script type="text/javascript">
  setTimeout(() => window.location.replace(document.querySelector('a').href), 3 * 1000);
</script>