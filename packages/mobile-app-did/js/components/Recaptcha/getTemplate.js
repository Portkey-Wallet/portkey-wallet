export default function getTemplate(params, enterprise, recaptchaDomain, gstaticDomain, hideBadge) {
  const grecaptcha = enterprise ? 'window.grecaptcha.enterprise' : 'window.grecaptcha';

  const validHost = recaptchaDomain || 'www.google.com';
  const gstaticHost = gstaticDomain || 'www.gstatic.com';

  const jsScript = enterprise
    ? `<script src="https://${validHost}/recaptcha/enterprise.js?hl={{lang}}" async defer></script>`
    : `<script src="https://${validHost}/recaptcha/api.js?hl={{lang}}" async defer></script>`;

  let template = `
    <!DOCTYPE html>
    <html lang="{{lang}}">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>

        <link rel="preconnect" href="https://${validHost}">
        <link rel="preconnect" href="https://${gstaticHost}" crossorigin>

        ${jsScript}

        <script>
            const siteKey = '{{siteKey}}';
            const theme = '{{theme}}';
            const size = '{{size}}';
            const action = '{{action}}';
    
            let readyInterval;
            let onCloseInterval;
            let widget;
            let onCloseObserver;
            
            let isOnCloseTriggeredInSeconds = false;
    
            const onClose = () => {
                isOnCloseTriggeredInSeconds = true;
                setTimeout(() => {
                  isOnCloseTriggeredInSeconds = false;
                }, 50);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    close: [],
                }));
            }
            
            const onClickOutSide = () => {
                if(isOnCloseTriggeredInSeconds) return;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    closeWebView: [],
                }));
            }
    
            const onLoad = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    load: [],
                }));
            }
    
            const onExpire = () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    expire: [],
                }));
            }
    
            const onError = (error) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    error: [error],
                }));
            }
    
            const onVerify = (token) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    verify: [token],
                }));
            }
    
            const isReady = () => Boolean(typeof window === 'object' && window.grecaptcha && ${grecaptcha}.render);
    
            const registerOnCloseListener = () => {
                if (onCloseObserver) {
                    onCloseObserver.disconnect();
                }
    
                const iframes = document.getElementsByTagName('iframe');
    
                const recaptchaFrame = Array.prototype.find
                    .call(iframes, e => e.src.includes('google.com/recaptcha/api2/bframe'));
                const recaptchaElement = recaptchaFrame.parentNode.parentNode;
    
                clearInterval(onCloseInterval);
    
                let lastOpacity = recaptchaElement.style.opacity;
                onCloseObserver = new MutationObserver(mutations => {
                    if (lastOpacity !== recaptchaElement.style.opacity
                        && recaptchaElement.style.opacity == 0) {
                        onClose();
                    }
                    lastOpacity = recaptchaElement.style.opacity;
                });
                onCloseObserver.observe(recaptchaElement, {
                    attributes: true,
                    attributeFilter: ['style'],
                });
            }
    
            const isRendered = () => {
                return typeof widget === 'number';
            }
    
            const renderRecaptcha = () => {
                const recaptchaParams = {
                    sitekey: siteKey,
                    size,
                    theme,
                    callback: onVerify,
                    'expired-callback': onExpire,
                    'error-callback': onError,
                }
                if (action) {
                    recaptchaParams.action = action;
                }
                widget = ${grecaptcha}.render('recaptcha-container', recaptchaParams);
                if (onLoad) {
                    onLoad();
                }
                onCloseInterval = setInterval(registerOnCloseListener, 1000);
            }
    
            const updateReadyState = () => {
                if (isReady()) {
                    clearInterval(readyInterval);
                    renderRecaptcha()
                }
            }
    
            if (isReady()) {
                renderRecaptcha();
            } else {
                readyInterval = setInterval(updateReadyState, 1000);
            }
    
            window.rnRecaptcha = {
                execute: () => {
                    ${grecaptcha}.execute(widget);
                },
                reset: () => {
                    ${grecaptcha}.reset(widget);
                },
            }
        </script>
    
        <style>
            html,
            body,
            .container {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: transparent;
            }
    
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            body > div:last-child > div:first-child {
              background-color: transparent !important;
            }

            body > div:last-child > div:last-child {
              top:auto !important;
            }
            
            ${hideBadge ? '.grecaptcha-badge { visibility: hidden; }' : ''}
        </style>
    </head>
    
    <body onClick="onClickOutSide()">
        <div class="container">
            <span id="recaptcha-container"></span>
        </div>
    </body>
    
    </html>`;

  Object.entries(params).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'img'), value);
  });

  return template;
}
