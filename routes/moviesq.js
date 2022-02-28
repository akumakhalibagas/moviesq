var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Movies page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM moviesq",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("moviesq/list", {
          title: "MoviesQ",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var movies = {
        id: req.params.id,
      };

      var delete_sql = "delete from moviesq where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          movies,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/moviesq");
            } else {
              req.flash("msg_info", "Delete Movies Success");
              res.redirect("/moviesq");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM moviesq where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/moviesq");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Movies can't be find!");
              res.redirect("/moviesq");
            } else {
              console.log(rows);
              res.render("moviesq/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the name").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_rilis = req.sanitize("rilis").escape().trim();
      v_rating = req.sanitize("rating").escape().trim();
      v_ditonton = req.sanitize("ditonton").escape();

      var movies = {
        nama: v_nama,
        rilis: v_rilis,
        rating: v_rating,
        ditonton: v_ditonton,
      };

      var update_sql = "update moviesq SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          movies,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("moviesq/edit", {
                nama: req.param("nama"),
                rilis: req.param("rilis"),
                rating: req.param("rating"),
                ditonton: req.param("ditonton"),
              });
            } else {
              req.flash("msg_info", "Update movies success");
              res.redirect("/moviesq/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/moviesq/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_rilis = req.sanitize("rilis").escape().trim();
    v_rating = req.sanitize("rating").escape().trim();
    v_ditonton = req.sanitize("ditonton").escape();

    var movies = {
      nama: v_nama,
      rilis: v_rilis,
      rating: v_rating,
      ditonton: v_ditonton,
    };

    var insert_sql = "INSERT INTO moviesq SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        movies,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("moviesq/add-movies", {
              nama: req.param("nama"),
              rilis: req.param("rilis"),
              rating: req.param("rating"),
              ditonton: req.param("ditonton"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create Movies success");
            res.redirect("/moviesq");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("moviesq/add-movies", {
      nama: req.param("nama"),
      rilis: req.param("rilis"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("moviesq/add-movies", {
    title: "Add New Movies",
    nama: "",
    rilis: "",
    rating: "",
    ditonton: "",
    session_store: req.session,
  });
});

module.exports = router;
