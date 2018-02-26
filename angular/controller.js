/*Defining angular module with 'ngRoute' dependency*/
var epl = angular.module('eplApp', ["ngRoute","ui.router"]);

//eplController with $http, $q services
epl.controller('eplController', ['$http', '$q', function($http, $q) {
  var main = this;
  this.combinedData = []; //for combining the match data from two files
  this.allData = function() {
    //fetching data from the first url of the year 2015-16
    main.firstData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json');
    //fetching data from the second url of the year 2016-17
    main.secondData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json');

    //combining all the promises...
    $q.all([main.firstData, main.secondData]).then(function successCallback(response1) {
        //on success following code will be executed
        this.firstDataRounds = [];
        this.secondDataRounds = [];
        this.firstDataRounds = response1[0].data.rounds; //data of 2015-16
        this.secondDataRounds = response1[1].data.rounds; //data of 2016-17

        //combinded data of 2015-16-17
        main.combinedData = response1[0].data.rounds.concat(response1[1].data.rounds);

      },
      function errorCallback(response) {
        //on error in combining the promises an error message is displayed
        alert("Error occurred");
      });
  } // end all Data
  this.allData(); //calling allData()function
}]); // end eplController


//matchViewController with $http, $q, $routeParams services
epl.controller('matchViewController', ['$http', '$q', '$routeParams', function($http, $q, $routeParams) {
  //declaring necessary variables
  var main = this;
  this.combinedData = [];
  this.teamName1 = "";
  this.teamName2 = "";
  this.teamCode1 = "";
  this.teamCode2 = "";
  this.teamKey1 = "";
  this.teamKey2 = "";
  this.teamScore1 = "";
  this.teamScore2 = "";
  this.roundName = "";
  this.matchDate = "";

  //getting date, team codes from the parameter of the url using $routepParams service
  this.date = $routeParams.date;
  this.team1code = $routeParams.team1code;
  this.team2code = $routeParams.team2code;


  this.allData = function() {

    main.firstData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json');
    main.secondData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json');
    $q.all([main.firstData, main.secondData]).then(function successCallback(response1) {

        this.firstDataRounds = [];
        this.secondDataRounds = [];
        this.firstDataRounds = response1[0].data.rounds;
        this.secondDataRounds = response1[1].data.rounds;

        main.combinedData = response1[0].data.rounds.concat(response1[1].data.rounds);


        //after combining all the promises matchFunction() will fetch necessary information 
        //to display in match-view.html page; through combinedData array.
        function matchFunction() {
          for (var i = 0; i < main.combinedData.length; i++) {

            var sameRoundNameData = main.combinedData[i];

            for (var j = 0; j < sameRoundNameData.matches.length; j++) {

              main.roundName = main.combinedData[i].name; //getting the round name
              var dateNew = sameRoundNameData.matches[j].date;
              dateNew = dateNew.replace(/[^\/\d]/g, ''); //getting and processing on the date

              if (dateNew == main.date && sameRoundNameData.matches[j].team1.code == main.team1code && sameRoundNameData.matches[j].team2.code == main.team2code) {
                //if calculated date, team codes from $routeParams and the same data fetched from the json files is same 
                //then following code will be executed

                //updating the values of the model which will automatically update the view
                main.matchDate = sameRoundNameData.matches[j].date; //date
                main.teamName1 = sameRoundNameData.matches[j].team1.name; //team1 name
                main.teamName2 = sameRoundNameData.matches[j].team2.name; //team2 name
                main.teamCode1 = sameRoundNameData.matches[j].team1.code; //team 1 code
                main.teamCode2 = sameRoundNameData.matches[j].team2.code; //team 2 code
                main.teamKey1 = sameRoundNameData.matches[j].team1.key; //team 1 key
                main.teamKey2 = sameRoundNameData.matches[j].team2.key; //team 2 key
                main.teamScore1 = sameRoundNameData.matches[j].score1; //team 1 score
                main.teamScore2 = sameRoundNameData.matches[j].score2; //team 2score

                //on the basis of the score; winner will be selected
                //if the scores of both the teams are same then "Match is Drawn" is displayed
                if (main.teamScore1 > main.teamScore2) {
                  main.matchWinner = main.teamName1;
                } else if (main.teamScore2 > main.teamScore1) {
                  main.matchWinner = main.teamName2;
                } else {
                  main.matchWinner = "Match is Drawn";
                }

              }
            }
          }
        }; //matchFunction end

        matchFunction(); //calling matchFunction()
      },
      function errorCallback(response) {
        alert("Error occurred");
      });
  } // end all Data
  this.allData(); //calling allDataFunction
}]); // end matchViewController


//teamViewController with $http, $q and $routeParams services
epl.controller('teamViewController', ['$http', '$q', '$routeParams', function($http, $q, $routeParams) {
  var main = this;

  //declaring necessary variables
  this.combinedData = [];

  this.totalMatchesPlayed2015_16 = [];
  this.totalWins2015_16 = [];
  this.totalLost2015_16 = [];
  this.totaltie2015_16 = [];
  this.totalgoals2015_16 = 0;

  this.totalMatchesPlayed2016_17 = [];
  this.totalWins2016_17 = [];
  this.totalLost2016_17 = [];
  this.totaltie2016_17 = [];
  this.totalgoals2016_17 = 0;

  this.totalMatchesPlayed = [];
  this.totalWins = [];
  this.totalLost = [];
  this.totaltie = [];
  this.totalgoals = 0;
  this.teamname1 = "";
  this.teamname2 = "";


  //getting teamcodes and teamkey from url through $routeParams service
  this.teamcode = $routeParams.teamcode;
  this.teamkey = $routeParams.teamkey;

  this.allData = function() {
    main.firstData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json');
    main.secondData = $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json');
    $q.all([main.firstData, main.secondData]).then(function successCallback(response1) {
        var main2 = this;
        
        this.MatchRounds2015_16 = [];
        this.MatchRounds2016_17 = [];

        this.matchData2015_16 = [];
        this.matchData2016_17 = [];

        this.MatchRounds2015_16 = response1[0].data.rounds;
        this.MatchRounds2016_17 = response1[1].data.rounds;

        main.combinedData = response1[0].data.rounds.concat(response1[1].data.rounds);

        //after combining all the promises matchFunction() will fetch necessary information 
        //to display in match-view.html page; through combinedData array.
        
        function teamFunction2015_16() {

          //getting and calculating the information for the year 2015-16

          for (var i = 0; i < main2.MatchRounds2015_16.length; i++) {
            for (var j = 0; j < main2.MatchRounds2015_16[i].matches.length; j++) {

              //getting the match data 'only' of the year 2015-16 from MatchRounds2015_16 array
              main2.matchData2015_16.push(main2.MatchRounds2015_16[i].matches[j]);
            }
          }

          //if the $roundParams service arguments match with the same of the json file data then
          //following code will be executed

          for (var i = 0; i < main2.matchData2015_16.length; i++) {
            if ((main2.matchData2015_16[i].team1.code === main.teamcode || main2.matchData2015_16[i].team2.code === main.teamcode) && (main2.matchData2015_16[i].team1.key === main.teamkey || main2.matchData2015_16[i].team2.key === main.teamkey)) {
                
                //For calculating total matches played by a team in 2015-16; 
                //match data of the same team is 'pushed' to the array which holds the information
                //about total matches played in 2015-16

                main.totalMatchesPlayed2015_16.push(main2.matchData2015_16[i].team1.name);


              if (main2.matchData2015_16[i].team1.code === main.teamcode && main2.matchData2015_16[i].team1.key === main.teamkey) {
                main.teamname1 = main2.matchData2015_16[i].team1.name;

                  //total goals scored by team in 2015-16 
                  main.totalgoals2015_16 = main.totalgoals2015_16 + main2.matchData2015_16[i].score1;

                if (main2.matchData2015_16[i].score1 > main2.matchData2015_16[i].score2) {
                  //total matches won by team in 2015-16
                  main.totalWins2015_16.push(main2.matchData2015_16[i].team2.code);

                } else if (main2.matchData2015_16[i].score1 < main2.matchData2015_16[i].score2) {
                  //total matches lost by team in 2015-16
                  main.totalLost2015_16.push(main2.matchData2015_16[i].team1.code);

                } else if (main2.matchData2015_16[i].score1 == main2.matchData2015_16[i].score2) {
                  //total drawn(tie) matches of the team in 2015-16
                  main.totaltie2015_16.push(main2.matchData2015_16[i].team1.code);
                } else {
                  //If no details are available...
                  alert("No Details available");
                }
              }

                  //For calculating total matches played by a team in 2015-16; 
                  //match data of the same team is 'pushed' to the array which holds the information
                  //about total matches played in 2015-16
                
              if (main2.matchData2015_16[i].team2.code === main.teamcode && main2.matchData2015_16[i].team2.key === main.teamkey) {
                //total goals by team in 2015-16
                main.totalgoals2015_16 = main.totalgoals2015_16 + main2.matchData2015_16[i].score2;

                if (main2.matchData2015_16[i].score1 < main2.matchData2015_16[i].score2) {
                  //total matches won by team in 2015-16
                  main.totalWins2015_16.push(main2.matchData2015_16[i].team2.code);
                } 

                else if (main2.matchData2015_16[i].score1 > main2.matchData2015_16[i].score2) {
                  //total matches lost by team in 2015-16
                  main.totalLost2015_16.push(main2.matchData2015_16[i].team1.code);
                } else if (main2.matchData2015_16[i].score1 == main2.matchData2015_16[i].score2) {
                  //total drawn matches of team in 2015-16
                  main.totaltie2015_16.push(main2.matchData2015_16[i].team1.code);
                } else {
                  alert("No Details available");
                }
              }
            }
          } // end for loop matchData2015_16
        }; //teamFunction for 2015-16 ends
        teamFunction2015_16(); //calling teamFunction2015_16()

        //function for 2016-17 data starts
        function teamFunction2016_17() {
           //getting and calculating the information for the year 2015-16
          for (var i = 0; i < main2.MatchRounds2016_17.length; i++) {
            for (var j = 0; j < main2.MatchRounds2016_17[i].matches.length; j++) {
               //getting the match data 'only' of the year 2015-16 from MatchRounds2015_16 array
                main2.matchData2016_17.push(main2.MatchRounds2016_17[i].matches[j]);
            }
          }
            //if the $roundParams service arguments match with the same of the json file data then
            //following code will be executed
          for (var i = 0; i < main2.matchData2016_17.length; i++) {
            if ((main2.matchData2016_17[i].team1.code === main.teamcode || main2.matchData2016_17[i].team2.code === main.teamcode) && (main2.matchData2016_17[i].team1.key === main.teamkey || main2.matchData2016_17[i].team2.key === main.teamkey)) {
              //For calculating total matches played by a team1 in 2016-17; 
              //match data of the same team is 'pushed' to the array which holds the information
              //about total matches played in 2016-17

              main.totalMatchesPlayed2016_17.push(main2.matchData2016_17[i].team1.name);

              if (main2.matchData2016_17[i].team1.code === main.teamcode && main2.matchData2016_17[i].team1.key === main.teamkey) {
                main.teamname2 = main2.matchData2016_17[i].team1.name;

                //total goals by team in 2016-17
                main.totalgoals2016_17 = main.totalgoals2016_17 + main2.matchData2015_16[i].score1;

                if (main2.matchData2016_17[i].score1 > main2.matchData2016_17[i].score2) {
                  //total matches won by team in 2016-17
                  main.totalWins2016_17.push(main2.matchData2016_17[i].team2.code);
                } else if (main2.matchData2016_17[i].score1 < main2.matchData2016_17[i].score2) {
                  //total matches lost by team in 2016-17
                  main.totalLost2016_17.push(main2.matchData2016_17[i].team1.code);
                } else if (main2.matchData2016_17[i].score1 == main2.matchData2016_17[i].score2) {
                  //total drawn matches of team in 2016-17
                  main.totaltie2016_17.push(main2.matchData2016_17[i].team1.code);
                } else {
                  alert("No Details available");
                }
              }

              if (main2.matchData2016_17[i].team2.code === main.teamcode && main2.matchData2016_17[i].team2.key === main.teamkey) {

                //total goals scored by team in 2016-17
                main.totalgoals2016_17 = main.totalgoals2016_17 + main2.matchData2015_16[i].score2;

                if (main2.matchData2016_17[i].score1 < main2.matchData2016_17[i].score2) {
                  //total matches won by team in 2016-17
                  main.totalWins2016_17.push(main2.matchData2016_17[i].team2.code);

                } else if (main2.matchData2016_17[i].score1 > main2.matchData2016_17[i].score2) {
                  //total matches lost by team in 2016-17
                  main.totalLost2016_17.push(main2.matchData2016_17[i].team1.code);

                } else if (main2.matchData2016_17[i].score1 == main2.matchData2016_17[i].score2) {
                  //total drawn matches of team in 2016-17
                  main.totaltie2016_17.push(main2.matchData2016_17[i].team1.code);

                } else {
                  alert("No Details available");
                }
              }
            }
          }
        }; //teamFunction2016_17 for 2016-17 ends

        teamFunction2016_17();

        //total team statstics are calculated here
        main.totalMatchesPlayed = main.totalMatchesPlayed2015_16.length + main.totalMatchesPlayed2016_17.length;
        main.totalWins = main.totalWins2015_16.length + main.totalWins2016_17.length;
        main.totalLost = main.totalLost2015_16.length + main.totalLost2016_17.length;
        main.totaltie = main.totaltie2015_16.length + main.totaltie2016_17.length;
        main.totalgoals = main.totalgoals2015_16 + main.totalgoals2016_17;
      },
      function errorCallback(response) {
        alert("Error occurred.");
      });
  } // end all Data
  this.allData(); //calling allData()
}]); // end teamViewController