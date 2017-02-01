import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

const styles   = require('./check.css');
const template = require('./check.html');

@Component({
    selector: 'check',
    template: template,
    styles: [ styles ]
})
export class Check {
}
