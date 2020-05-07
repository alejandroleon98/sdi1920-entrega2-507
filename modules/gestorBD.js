module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    insertarUsuario: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.insert(usuario, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.find(criterio).toArray(function (err, usuarios) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerUsuariosPg: function (criterio, pg, usuarioLogueado, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, usuarios) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                var usuariosSinUsuarioLogueado = usuarios.filter(function (value, index, arr) {
                                    return value.email != usuarioLogueado;
                                });
                                funcionCallback(usuariosSinUsuarioLogueado, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    insertarInvitacion: function (usuarioFrom, usuarioTo, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                var invitacion = {
                    usuarioFrom: usuarioFrom,
                    usuarioTo: usuarioTo
                };
                collection.insert(invitacion, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerInvitaciones: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.find(criterio).toArray(function (err, invitaciones) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(invitaciones);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerInvitacionesPg: function (criterio, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, invitaciones) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(invitaciones, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    eliminarInvitacion: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.remove(criterio, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    insertarAmigos: function (email1, email2, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('amigos');
                let amistad = {
                    email1: email1,
                    email2: email2
                }
                collection.insert(amistad, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerAmigos: function (usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let criterio = {
                    $or: [
                        {
                            "email1": usuario
                        },
                        {
                            "email2": usuario
                        }
                    ]
                }
                let collection = db.collection('amigos');
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        /**
                         * Los amigos ya se ordenan en widget-amigos.html
                         * Pero está bien que la lista vaya ya ordenada porque así de
                         * primeras ya se lista bien.
                         */
                        for (i = 0; i < amigos.length - 1; i++) {
                            if ((amigos[i].time == null && amigos[i + 1].time != null) || amigos[i].time < amigos[i + 1].time) {
                                var temp = amigos[i];
                                amigos[i] = amigos[i + 1];
                                amigos[i + 1] = temp;
                            }
                        }
                        funcionCallback(amigos);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerAmigosPg: function (usuario, pg, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let criterio = {
                    $or: [
                        {
                            "email1": usuario
                        },
                        {
                            "email2": usuario
                        }
                    ]
                }
                let collection = db.collection('amigos');
                collection.count(function (err, count) {
                    collection.find(criterio).skip((pg - 1) * 5).limit(5)
                        .toArray(function (err, amigos) {
                            if (err) {
                                funcionCallback(null);
                            } else {
                                funcionCallback(amigos, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },
    comprobarSiSonAmigos: function (usuario1, usuario2, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let criterio = {
                    $or: [
                        {
                            $and: [
                                {"email1": usuario1},
                                {"email2": usuario2}
                            ]
                        },
                        {
                            $and: [
                                {"email2": usuario1},
                                {"email1": usuario2}
                            ]
                        }
                    ]
                };
                let collection = db.collection('amigos');
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(amigos.length > 0);
                    }
                    db.close();
                });
            }
        });
    },
    comprobarSiHayInvitaciones: function (usuario1, usuario2, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let criterio = {
                    $or: [
                        {
                            $and: [
                                {"usuarioFrom": usuario1},
                                {"usuarioTo": usuario2}
                            ]
                        },
                        {
                            $and: [
                                {"usuarioTo": usuario1},
                                {"usuarioFrom": usuario2}
                            ]
                        }
                    ]
                };
                let collection = db.collection('invitaciones');
                collection.find(criterio).toArray(function (err, amigos) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(amigos.length > 0);
                    }
                    db.close();
                });
            }
        });
    },
    insertarMensaje: function (mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.insert(mensaje, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerMensajes: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.find(criterio).toArray(function (err, mensajes) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(mensajes);
                    }
                    db.close();
                });
            }
        });
    },
    modificarMensajeMarcarLeido: function (criterio, mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.update(criterio, {
                    $set: mensaje
                }, {multi: true}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    modificarAmigos: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var fecha = new Date();
                var time = {"time": fecha.getTime()};
                let collection = db.collection('amigos');
                collection.update(criterio, {
                    $set: time
                }, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    //Limpiar BD
    eliminarUsuarios: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.remove({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarInvitaciones: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('invitaciones');
                collection.remove({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarAmigos: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('amigos');
                collection.remove({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarMensajes: function (funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('mensajes');
                collection.remove({}, function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }
};