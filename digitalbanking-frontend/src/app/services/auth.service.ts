import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/login`, {
      username,
      password
    }).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.setUser({
          username: response.username,
          roles: response.roles
        });
        this.currentUserSubject.next({
          username: response.username,
          roles: response.roles
        });
      })
    );
  }

  register(username: string, password: string, confirmedPassword: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/signup`, {
      username,
      password,
      confirmedPassword
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${API_URL}/auth/changePassword`, {
      oldPassword,
      newPassword
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${API_URL}/auth/profile`);
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getUser(): any {
    return this.getUserFromStorage();
  }

  setUser(user: any): void {
    if (this.isBrowser()) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  getUserFromStorage(): any {
    if (this.isBrowser()) {
      const user = localStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
    return null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Fonction utilitaire pour vérifier si nous sommes dans un navigateur
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
}
