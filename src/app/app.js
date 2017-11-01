import angular from 'angular';
import angularResource from 'angular-resource';
import angularUiRouter from '@uirouter/angularjs';

import {routing, run} from './app.config';

import './app.scss';

angular.module('app', [angularResource, angularUiRouter])
	.config(routing)
	.run(run);
