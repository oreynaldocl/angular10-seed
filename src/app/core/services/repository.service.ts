import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


import { Repository, RepositoryList } from '../models';
import { UtilsService } from './utils.service';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class RepositoryService {
  pageSize = 4;

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
  ) { }

  getRepositories(user: string, page = 1): Observable<RepositoryList> {
    const url = `/users/${user}/repos?per_page=${this.pageSize}&page=${page}`;
    return this.http.get<RepositoryList>(url, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<any>) => {
        const pullCountRequests = this.createRequests(user, response);
        return forkJoin([
          of(response),
          ...pullCountRequests,
        ]);
      }),
      map(([responseBase, ...counts]) => {
        const response = responseBase as HttpResponse<any>;
        const repositories = response.body.map(this.mapRepository);
        repositories.forEach((repo: Repository, index: number) => {
          repo.openIssues = repo.issues - (+counts[index]);
        });
        const links = response.headers.get('Link');
        let last = this.utilsService.getLastPage(links);
        last = this.fixValueLastPage(last, links, page);
        return {
          metadata: {
            size: last * this.pageSize,
          },
          repositories,
        };
      })
    );
  }

  private fixValueLastPage(lastPage: number, links: string, page: number): number {
    if (lastPage === 0 && (links && links.indexOf('"first"')) >= 0) {
      return page;
    }
    return lastPage;
  }

  private createRequests(owner: string, response: HttpResponse<any>): Observable<number>[] {
    return response.body.map(item => {
      return this.getCountPulls(owner, item.name);
    });
  }

  private getCountPulls(owner: string, repo: string): Observable<number> {
    const url = `/repos/${owner}/${repo}/pulls?per_page=1`;
    return this.http.get<number>(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        let lastPage = this.utilsService.getLastPage(response.headers.get('Link'));
        if (lastPage === 0 && response.body && response.body.length === 1) {
          lastPage = 1;
        }
        return lastPage;
      })
    );
  }

  private mapRepository(responseRepository: any): Repository {
    const { html_url, name, description, open_issues, forks } = responseRepository;
    const repository: Repository = {
      repoUrl: html_url,
      name,
      description,
      issues: +open_issues + 0,
      openIssues: +open_issues,
      forks,
    };
    return repository;
  }
}
