let envPath = __dirname + '/../.env';
require('dotenv').config({ path: envPath });
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let User = require('../Users');
let Movie = require('../Movies');
chai.should();

chai.use(chaiHttp);

let login_details = {
    name: 'test',
    username: 'email@email.com',
    password: '123@abc'
};

// random movies off of IMDB cause I don't watch movies
let movie_details = [
    {
        title: 'The Batman',
        yearReleased: 2022,
        genre: 'Action',
        actors: [
            {
                actorName: 'Zoe Kravitz',
                characterName: 'Catwoman'
            },
            {
                actorName: 'Robert Pattinson',
                characterName: 'Batman'
            },
            {
                actorName: 'Paul Dano',
                characterName: 'The Riddler'
            }
        ]
    },
    {
        title: 'Spider-Man: No Way Home',
        yearReleased: 2021,
        genre: 'Fantasy',
        actors: [
            {
                actorName: 'Tom Holland',
                characterName: 'Peter Parker'
            },
            {
                actorName: 'Zendaya',
                characterName: 'MJ'
            },
            {
                actorName: 'Benedict Cumberbatch',
                characterName: 'Doctor Strange'
            }
        ]
    },
    {
        title: 'Skyfall',
        yearReleased: 2012,
        genre: 'Adventure',
        actors: [
            {
                actorName: 'Daniel Craig',
                characterName: 'James Bond'
            },
            {
                actorName: 'Judi Dench',
                characterName: 'M'
            },
            {
                actorName: 'Javier Bardem',
                characterName: 'Silva'
            }
        ]
    },
    {
        title: 'Kingsman: The Secret Service',
        yearReleased: 2014,
        genre: 'Comedy',
        actors: [
            {
                actorName: 'Colin Firth',
                characterName: 'Harry Hart'
            },
            {
                actorName: 'Taron Egerton',
                characterName: "Gary 'Eggsy' Unwin"
            },
            {
                actorName: 'Samuel L. Jackson',
                characterName: 'Valentine'
            }
        ]
    },
    {
        title: 'Ghostbusters',
        yearReleased: 1984,
        genre: 'Comedy',
        actors: [
            {
                actorName: 'Bill Murray',
                characterName: 'Dr. Peter Venkman'
            },
            {
                actorName: 'Harold Ramis',
                characterName: 'Dr. Egon Spengler'
            },
            {
                actorName: 'Sigourney Weaver',
                characterName: 'Dana Barrett'
            }
        ]
    }
];

function removeUnderscoreProps(obj) {
    let asArray = Object.entries(obj);
    let filtered = asArray.filter(([key, value]) => !key.startsWith('_'));
    return Object.fromEntries(filtered);
}

describe('All Tests', () => {
    // test the sign up functionality and sign in functionality
    describe('/signup', () => {
        before((done) => {
            // delete test user if it exists so that we don't have issues
            User.deleteOne({ username: 'email@email.com' }, (err, user) => {
                if (err) throw err;
                done();
            });
        });

        it('it should sign up and sign in and get a token', (done) => {
            chai.request(server)
                .post('/signup')
                .send(login_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    res.body.should.have.property('msg');
                    //follow-up to get the JWT token from signing in
                    chai.request(server)
                        .post('/signin')
                        .send(login_details)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.have.property('token');
                            let token = res.body.token;
                            done();
                        });
                });
        });

        it('it should fail signing up with an invalid password', (done) => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: 'newemail@email.com',
                    password: '123@abc'
                })
                .end((err, res) => {
                    //follow-up to get the JWT token from signing in
                    chai.request(server)
                        .post('/signin')
                        .send({
                            username: 'newemail@email.com',
                            password: 'adjfad;fs'
                        })
                        .end((err, res) => {
                            console.log(res.body);
                            res.should.have.status(401);
                            res.body.success.should.be.eql(false);
                            done();
                        });
                });
        });

        it('it should fail when signing in with an user that doesnt exist', (done) => {
            chai.request(server)
                .post('/signin')
                .send({ name: 'test', username: 'thisemaildoesntexist@gmail.com', password: 'no' })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(401);
                    res.body.success.should.be.eql(false);
                    done();
                });
        });

        it('it should fail when signing in without a password', (done) => {
            chai.request(server)
                .post('/signup')
                .send({
                    username: 'newemail@email.com',
                    password: '123@abc'
                })
                .end((err, res) => {
                    //follow-up to get the JWT token from signing in
                    chai.request(server)
                        .post('/signin')
                        .send({
                            username: 'newemail@email.com'
                        })
                        .end((err, res) => {
                            console.log(res.body);
                            res.should.have.status(401);
                            res.body.success.should.be.eql(false);
                            done();
                        });
                });
        });

        it('it should return an error when signing up with an already used email', (done) => {
            let new_login_details = JSON.parse(JSON.stringify(login_details));
            new_login_details.username = 'anewemail@email.com';
            chai.request(server)
                .post('/signup')
                .send(new_login_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    //follow-up to try signing up with the already used one
                    chai.request(server)
                        .post('/signup')
                        .send(new_login_details)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.success.should.be.eql(false);
                            done();
                        });
                });
        });
    });

    describe('/movies*', () => {
        let token = '';
        // before this test suite, sign up and sign in & save token
        before((done) => {
            chai.request(server)
                .post('/signin')
                .send(login_details)
                .end((err, res) => {
                    token = res.body.token;
                    done();
                });
        });

        describe('/movies POST', () => {
            after((done) => {
                // delete movie added after test
                Movie.deleteOne(
                    { title: movie_details[0].title },
                    (err, movie) => {
                        if (err) throw err;
                        done();
                    }
                );
            });

            it('it should add the valid movie', (done) => {
                chai.request(server)
                    .post('/movies')
                    .set('Authorization', token)
                    .send(movie_details[0])
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(200);
                        done();
                    });
            });
            it('it should not succeed for a movie with an invalid genre', (done) => {
                let movie_copy = JSON.parse(JSON.stringify(movie_details[0]));
                movie_copy['genre'] = 'act';
                chai.request(server)
                    .post('/movies')
                    .set('Authorization', token)
                    .send(movie_copy)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(400);
                        done();
                    });
            });
            it('it should not succeed for a movie without actors', (done) => {
                let movie_copy = JSON.parse(JSON.stringify(movie_details[0]));
                delete movie_copy.actors;
                chai.request(server)
                    .post('/movies')
                    .set('Authorization', token)
                    .send(movie_copy)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(400);
                        done();
                    });
            });
            it('it should not succeed for a movie with invalid actors', (done) => {
                let movie_copy = JSON.parse(JSON.stringify(movie_details[0]));
                delete movie_copy.actors[0].characterName;
                chai.request(server)
                    .post('/movies')
                    .set('Authorization', token)
                    .send(movie_copy)
                    .end((err, res) => {
                        console.log(res.body);
                        res.should.have.status(400);
                        done();
                    });
            });
            it('it should not allow unauthorized access', (done) => {
                chai.request(server)
                    .post('/movies')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.text.should.be.eql('Unauthorized');
                        done();
                    });
            });
        });

        describe('/movies PUT', () => {
            it('it should return an error for this invalid method', (done) => {
                chai.request(server)
                    .put('/movies')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(405);
                        res.text.should.eql('Method not allowed');
                        done();
                    });
            });
        });

        describe('/movies GET empty', () => {
            it('it should get all the movies added', (done) => {
                chai.request(server)
                    .get('/movies')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        JSON.stringify(res.body).should.equal('[]');
                        done();
                    });
            });
        });

        describe('/movies GET,DELETE,PUT', () => {
            before((done) => {
                chai.request(server)
                    .post('/movies')
                    .set('Authorization', token)
                    .send(movie_details[0])
                    .end((err, res) => {
                        chai.request(server)
                            .post('/movies')
                            .set('Authorization', token)
                            .send(movie_details[1])
                            .end((err, res) => {
                                chai.request(server)
                                    .post('/movies')
                                    .set('Authorization', token)
                                    .send(movie_details[2])
                                    .end((err, res) => {
                                        chai.request(server)
                                            .post('/movies')
                                            .set('Authorization', token)
                                            .send(movie_details[3])
                                            .end((err, res) => {
                                                chai.request(server)
                                                    .post('/movies')
                                                    .set('Authorization', token)
                                                    .send(movie_details[4])
                                                    .end((err, res) => {
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });

            /*after((done) => {
                chai.request(server)
                    .delete('/movies/'+movie_details[0].title)
                    .set('Authorization', token)
                    .end((err, res) => {
                        chai.request(server)
                            .delete('/movies/'+movie_details[1].title)
                            .set('Authorization', token)
                            .end((err, res) => {
                                chai.request(server)
                                    .delete('/movies/'+movie_details[2].title)
                                    .set('Authorization', token)
                                    .end((err, res) => {
                                        chai.request(server)
                                            .delete('/movies/'+movie_details[3].title)
                                            .set('Authorization', token)
                                            .end((err, res) => {
                                                chai.request(server)
                                                    .delete('/movies/'+movie_details[4].title)
                                                    .set('Authorization', token)
                                                    .end((err, res) => {
                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });*/

            it('it should get all the movies added', (done) => {
                chai.request(server)
                    .get('/movies')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.length(5);
                        let newBody = JSON.parse(JSON.stringify(res.body));
                        newBody = newBody.map(movie => {
                            movie.actors = movie.actors.map(act => removeUnderscoreProps(act));
                            return removeUnderscoreProps(movie);
                        });
                        JSON.stringify(newBody).should.be.eql(JSON.stringify(movie_details));
                        done();
                    });
            });
            it('it should get one movie', (done) => {
                chai.request(server)
                    .get('/movies/' + movie_details[0].title)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        let newBody = JSON.parse(JSON.stringify(res.body));
                        newBody.actors = newBody.actors.map(act => removeUnderscoreProps(act));
                        newBody = removeUnderscoreProps(newBody);
                        JSON.stringify(newBody).should.be.eql(
                            JSON.stringify(movie_details[0])
                        );
                        done();
                    });
            });
            it('it should not get a movie that does not exist', (done) => {
                chai.request(server)
                    .get('/movies/This Movie Doesnt Exist')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        JSON.stringify(res.body).should.be.eql("null");
                        done();
                    });
            });
            it('it should delete one movie', (done) => {
                chai.request(server)
                    .delete('/movies/Skyfall')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        chai.request(server)
                            .get('/movies')
                            .set('Authorization', token)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.have.length(4);
                                res.body
                                    .map((item) => item.title)
                                    .should.not.include('Skyfall');
                                res.body
                                    .map((item) => item.title)
                                    .should.include('The Batman');
                                done();
                            });
                    });
            });
            it('it should return not successful for deleting an item that doesnt exist', (done) => {
                chai.request(server)
                    .delete('/movies/This Movie Doesnt Exist')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.success.should.be.eql(false);
                        done();
                    });
            });
            it('it should update a movie correctly', (done) => {
                chai.request(server)
                    .put('/movies/' + movie_details[3].title)
                    .send({ genre: 'Action', yearReleased: 2013 })
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.success.should.be.eql(true);
                        chai.request(server)
                            .get('/movies/' + movie_details[3].title)
                            .set('Authorization', token)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.title.should.be.eq(
                                    movie_details[3].title
                                );
                                res.body.yearReleased.should.be.eq(2013);
                                res.body.genre.should.be.eq('Action');
                                done();
                            });
                    });
            });
            it('it should return not successful for updating an item that doesnt exist', (done) => {
                chai.request(server)
                    .put('/movies/This Movie Doesnt Exist')
                    .send({ genre: 'Action', yearReleased: '2013' })
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.success.should.be.eql(false);
                        done();
                    });
            });
            it('it shouldn\'t update an item where the update has an invalid value', (done) => {
                chai.request(server)
                    .put('/movies/' + movie_details[0].title)
                    .send({ genre: 'act', yearReleased: 2013 })
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(400);
                        console.log(res.body);
                        chai.request(server)
                            .get('/movies/' + movie_details[0].title)
                            .set('Authorization', token)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.yearReleased.should.be.eql(movie_details[0].yearReleased);
                                done();
                            });
                    });
            });
            it('it should return an error for updating the actors to an invalid value', (done) => {
                chai.request(server)
                    .put('/movies/' + movie_details[0].title)
                    .send({ yearReleased: 'hi', actors: movie_details[0].actors.slice(0,2) })
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(400);
                        console.log(res.body);
                        done();
                    });
            });
        });
    });
});
