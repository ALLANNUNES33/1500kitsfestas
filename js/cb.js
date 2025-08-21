(function () {
  window.document.addEventListener("DOMContentLoaded", function () {
    const script = document.querySelector('script[data-site-id]');
    const site_id = script?.getAttribute('data-site-id');

    if (!site_id) {
      console.warn("CB: site_id não encontrado no atributo data-site-id.");
      return;
    }

    const domain = window.location.hostname;
    const fullUrl = window.location.origin + window.location.pathname; // <- caminho completo sem hash nem query

    function getTimestampBrasiliaISO() {
      const agora = new Date();

      const brasiliaDateTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
        .formatToParts(agora)
        .reduce((acc, part) => {
          acc[part.type] = part.value;
          return acc;
        }, {});

      const { year, month, day, hour, minute, second } = brasiliaDateTime;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}-03:00`;
    }

    async function registrarAcesso() {
      let ip = null;
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
      } catch (err) {
        console.warn("NinjaBlock: erro ao obter IP", err);
      }

      const payload = {
        domain,
        ip,
        site_id,
        acesso_em: getTimestampBrasiliaISO(),
        fullUrl, // <- novo campo enviado
      };

      try {
        await fetch(
          "https://ilekhzqwjqycfgbqywvw.supabase.co/functions/v1/registraracesso",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } catch (err) {
        console.error("CB: erro ao registrar acesso:", err);
      }
    }

    async function verificarAcao() {
      try {
        const response = await fetch(
          "https://ilekhzqwjqycfgbqywvw.supabase.co/functions/v1/verificaracao",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ domain, site_id }),
          }
        );

        const resultado = await response.json();
        console.log("CB: ação a ser tomada:", resultado);

        switch (resultado.acao) {
          case "redirect":
            window.location = resultado.to;
            break;
          case "redirect_links":
            const links = document.querySelectorAll('a, button');
            Array.from(links).forEach(link => {
              link.href = resultado.to;
              link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = resultado.to;
              }, true);
            });
            break;
          case "block_images":
            const nova_imagem = resultado.to;
            document.querySelectorAll("img").forEach((img) => {
              img.removeAttribute("srcset");
              img.src = nova_imagem;
            });
            document.querySelectorAll("*").forEach((el) => {
              const style = getComputedStyle(el);
              const bgImage = style.backgroundImage;
              if (bgImage && bgImage !== "none") {
                el.style.backgroundImage = `url("${nova_imagem}")`;
              }
              const inlineStyle = el.getAttribute("style");
              if (inlineStyle && inlineStyle.includes("background-image")) {
                el.setAttribute(
                  "style",
                  inlineStyle.replace(
                    /background-image:\s*url\(["']?.*?["']?\)/,
                    `background-image: url("${nova_imagem}")`
                  )
                );
              }
            });
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("CB: erro ao verificar ação:", err);
      }
    }

    registrarAcesso().then(() => {
      console.log("CB: Acesso registrado com sucesso.");
      verificarAcao();
    });
  });
})();
