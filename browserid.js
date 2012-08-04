(function ($) {
//https://gist.github.com/2971878
Drupal.behaviors.browserid = function(context) {
    function performLogin() {        
        navigator.id.getVerifiedEmail(function(assertion) {
        if (assertion) {
            
            $.post(Drupal.settings.basePath +'index.php?q=browserid/verify', {
                'assertion': assertion,
                'token': Drupal.settings.browserid.token
            }, function (data) {                
            if (data.reload) {
                window.location.reload();
            }
            else if (data.destination) {
                window.location.href = data.destination;
            }
            else {
                alert(Drupal.t('An unknown error occurred while attempting to validate your BrowserID login. After clicking "OK," you will be redirected to a page where you can log in without BrowserID or try logging in with BrowserID again.'));
                window.location.href = Drupal.settings.basePath + 'index.php?q=user/login';
            }
            });
        }
        });
    }
    ///
    $(context).find('.browserid-button').show();
    $(context).find('.browserid-button').click(function(e) {performLogin()});

    if (navigator.id) {
      if (Drupal.settings.browserid) {
        navigator.id.sessions = [{ email: Drupal.settings.browserid.email }];
      }
      else {
        navigator.id.sessions = [];
      }

      document.addEventListener('login', function(e) {
        Drupal.behaviors.browserid.performLogin();
      }, false);
      document.addEventListener('logout', function(e) {
        window.location.href = Drupal.settings.basePath + 'index.php?q=user/logout';
      }, false);
    }
  }
})(jQuery);