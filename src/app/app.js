import angular from 'angular';
import angularResource from 'angular-resource';
import angularUiRouter from 'angular-ui-router';

import {routing, run} from './app.config';

import 'normalize.css';

angular.module('app', [angularResource, angularResource])
	.config(routing)
	.run(run);
