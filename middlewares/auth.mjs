export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    } else {
      res.redirect('/login');
    }
  };

  export function attachUser(req, res, next) {
    res.locals.user = req.session.user || null;
    next();
  }