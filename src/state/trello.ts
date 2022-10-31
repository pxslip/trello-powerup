import type { Trello } from "typings/trello";
/**
 * Access the trello REST Api via methods here
 */

export const beginAuthFlow = async (trello: Trello.PowerUp.IFrame) => {
  return await trello.getRestApi().authorize({ scope: 'read,write' });
};

export default class Api {
  key: string;
  token: string;
  _member: Member | null = null;
  _board: Board | null = null;
  _list: List | null = null;
  _card: Card | null = null;

  constructor(key: string, token: string) {
    this.key = key;
    this.token = token;
  }

  get member() {
    if (!this._member) {
      this._member = new Member(this.key, this.token);
    }
    return this._member;
  }

  get board() {
    if (!this._board) {
      this._board = new Board(this.key, this.token);
    }
    return this._board;
  }

  get list() {
    if (!this._list) {
      this._list = new List(this.key, this.token);
    }
    return this._list;
  }

  get card() {
    if (!this._card) {
      this._card = new Card(this.key, this.token);
    }
    return this._card;
  }
}

class ApiGroup {
  baseUrl = 'https://api.trello.com/1/';
  authParams: URLSearchParams;

  constructor(key: string, token: string) {
    this.authParams = new URLSearchParams({ key, token });
  }
  fetch(url: URL | string, options: object) {
    return fetch(url, options);
  }
  generateUrl(path: string, params?: URLSearchParams): URL {
    params = params || this.authParams;
    return new URL(`${path}?${params.toString()}`, this.baseUrl)
  }
}

export class Member extends ApiGroup {

  /**
   * Get the user identified by the username or id
   */
  async get(id: string) {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('boards', 'open');
    const url = new URL(`members/${id}?${searchParams.toString()}`, this.baseUrl);
    const resp = await fetch(url, { method: 'GET' });
    if (resp.ok) {
      return await resp.json();
    }
  }
}

export class Board extends ApiGroup {
  async lists(id: string): Promise<Trello.PowerUp.List[] | void> {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('filter', 'open');
    searchParams.append('fields', 'id,name');
    const url = new URL(`boards/${id}/lists?${searchParams.toString()}`, this.baseUrl);
    const resp = await fetch(url, { method: 'GET' });
    if (resp.ok) {
      return resp.json();
    }
  }
}

export class List extends ApiGroup {
  async cards(id: string) {
    const url = new URL(`lists/${id}/cards?${this.authParams.toString()}`, this.baseUrl);
    const resp = await fetch(url, { method: 'GET' });
    if (resp.ok) {
      return resp.json();
    }
  }

  async create(name: string, idBoard: string, position: string | number = 'bottom') {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('name', name);
    searchParams.append('idBoard', idBoard);
    searchParams.append('pos', position);
    const url = this.generateUrl(`lists`, searchParams);
    const resp = await fetch(url, { method: 'POST' });
    return resp;
  }
}

export class Card extends ApiGroup {

  async update(id: string, card: Card) {
    // add the auth param values
    for (const [key, value] of this.authParams.entries()) {
      card[key] = value;
    }
    // remove any unused values from the object
    if (Array.isArray(card.idLabels)) {
      card.idLabels = card.idLabels.join(',');
    }
    const searchParams = new URLSearchParams(card);
    const url = this.generateUrl(`cards/${id}`, searchParams);
    const resp = await this.fetch(url, { method: 'PUT' });
    return resp;
  }

  async addLabel(id: string, labelId: string) {
    try {
      const searchParams = new URLSearchParams(this.authParams);
      searchParams.append('value', labelId);
      const url = this.generateUrl(`cards/${id}/idLabels`, searchParams);
      const resp = await this.fetch(url, { method: 'POST' });
      return resp.ok;
    } catch (exc) {
      return true;
    }
  }
  /**
   * Add an attachment to the card identifed by id
   * TODO: This should either have a more specific name, or a more generic set of parameters - see https://developer.atlassian.com/cloud/trello/rest/api-group-cards/#api-cards-id-attachments-post
   */
  async addAttachment(id: string, name: string, url: string) {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('name', name);
    searchParams.append('url', url);
    const resp = await this.fetch(this.generateUrl(`cards/${id}/attachments`, searchParams), { method: 'POST' });
    return resp.ok;
  }

  async addAttachmentIfNotExists(id: string, name: string, url: string) {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('fields', 'id,name,url');
    const existResp = await this.fetch(this.generateUrl(`cards/${id}/attachments`, searchParams), { method: 'GET' });
    if (existResp.ok) {
      const attachments = await existResp.json();
      for (const attachment of attachments) {
        if (attachment.name === name) {
          // abort and return true if the attachment exists and has the same url
          if (attachment.url === url) {
            return true;
          }
          await this.deleteAttachment(id, attachment.id);
        }
      }
      return this.addAttachment(id, name, url);
    }
  }

  async moveCard(id: string, idBoard: string, idList: string) {
    const searchParams = new URLSearchParams(this.authParams);
    searchParams.append('idBoard', idBoard);
    searchParams.append('idList', idList);
    const url = new URL(`?${searchParams.toString()}`, this.baseUrl);
    const resp = await this.fetch(this.generateUrl(`cards/${id}`, searchParams), { method: 'PUT' });
    return resp.ok;
  }

  async deleteAttachment(id: string, attachmentId: string) {
    const resp = await this.fetch(this.generateUrl(`cards/${id}/attachments/${attachmentId}`), { method: 'DELETE' });
    return resp.ok;
  }
}