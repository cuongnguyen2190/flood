import axios from 'axios';

import type {AddTorrentByURLOptions, MoveTorrentsOptions} from '@shared/types/Action';
import type {TorrentProperties} from '@shared/types/Torrent';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ConfigStore from '../stores/ConfigStore';

const baseURI = ConfigStore.getBaseURI();

const TorrentActions = {
  addTorrentsByUrls: (options: AddTorrentByURLOptions) =>
    axios
      .post(`${baseURI}api/client/add`, options)
      .then((json) => json.data)
      .then(
        (response) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_ADD_TORRENT_SUCCESS',
            data: {
              count: options.urls.length,
              destination: options.destination,
              response,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_ADD_TORRENT_ERROR',
            data: {
              error,
            },
          });
        },
      ),

  addTorrentsByFiles: (formData: FormData, destination: string) =>
    axios
      .post(`${baseURI}api/client/add-files`, formData)
      .then((json) => json.data)
      .then(
        (response) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_ADD_TORRENT_SUCCESS',
            data: {
              count: formData.getAll('torrents').length,
              destination,
              response,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_ADD_TORRENT_ERROR',
            data: {
              error,
            },
          });
        },
      ),

  deleteTorrents: (hashes: Array<TorrentProperties['hash']>, deleteData: boolean) =>
    axios
      .post(`${baseURI}api/client/torrents/delete`, {hashes, deleteData})
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_REMOVE_TORRENT_SUCCESS',
            data: {
              data,
              count: hashes.length,
              deleteData,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_REMOVE_TORRENT_ERROR',
            error: {
              error,
              count: hashes.length,
            },
          });
        },
      ),

  checkHash: (hashes: Array<TorrentProperties['hash']>) =>
    axios
      .post(`${baseURI}api/client/torrents/check-hash`, {hashes})
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_CHECK_HASH_SUCCESS',
            data: {
              data,
              count: hashes.length,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_CHECK_HASH_ERROR',
            error: {
              error,
              count: hashes.length,
            },
          });
        },
      ),

  fetchTorrentDetails: (hash: TorrentProperties['hash']) =>
    axios
      .post(`${baseURI}api/client/torrent-details`, {
        hash,
      })
      .then((json) => json.data)
      .then(
        (torrentDetails) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_FETCH_TORRENT_DETAILS_SUCCESS',
            data: {
              hash,
              torrentDetails,
            },
          });
        },
        () => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_FETCH_TORRENT_DETAILS_ERROR',
            data: {
              hash,
            },
          });
        },
      ),

  moveTorrents: (hashes: Array<TorrentProperties['hash']>, options: MoveTorrentsOptions) => {
    const {destination, isBasePath, filenames, sourcePaths, moveFiles, isCheckHash} = options;

    return axios
      .post(`${baseURI}api/client/torrents/move`, {
        hashes,
        destination,
        isBasePath,
        filenames,
        sourcePaths,
        moveFiles,
        isCheckHash,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_MOVE_TORRENTS_SUCCESS',
            data: {
              data,
              count: hashes.length,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_MOVE_TORRENTS_ERROR',
            error,
          });
        },
      );
  },

  startTorrents: (hashes: Array<TorrentProperties['hash']>) =>
    axios
      .post(`${baseURI}api/client/start`, {
        hashes,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_START_TORRENT_SUCCESS',
            data,
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_START_TORRENT_ERROR',
            error,
          });
        },
      ),

  stopTorrents: (hashes: Array<TorrentProperties['hash']>) =>
    axios
      .post(`${baseURI}api/client/stop`, {
        hashes,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_STOP_TORRENT_SUCCESS',
            data,
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_STOP_TORRENT_ERROR',
            error,
          });
        },
      ),

  setPriority: (hash: TorrentProperties['hash'], priority: number) =>
    axios
      .patch(`${baseURI}api/client/torrents/${hash}/priority`, {
        hash,
        priority,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TORRENT_PRIORITY_SUCCESS',
            data,
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TORRENT_PRIORITY_ERROR',
            error,
          });
        },
      ),

  setFilePriority: (hash: TorrentProperties['hash'], fileIndices: Array<number>, priority: number) =>
    axios
      .patch(`${baseURI}api/client/torrents/${hash}/file-priority`, {
        hash,
        fileIndices,
        priority,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_FILE_PRIORITY_SUCCESS',
            data: {
              ...data,
              hash,
              fileIndices,
              priority,
            },
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_FILE_PRIORITY_ERROR',
            error,
          });
        },
      ),

  setTaxonomy: (hashes: Array<TorrentProperties['hash']>, tags: Array<string>, options = {}) =>
    axios
      .patch(`${baseURI}api/client/torrents/taxonomy`, {
        hashes,
        tags,
        options,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TAXONOMY_SUCCESS',
            data,
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TAXONOMY_ERROR',
            error,
          });
        },
      ),

  setTracker: (hashes: Array<TorrentProperties['hash']>, tracker: string, options = {}) =>
    axios
      .patch(`${baseURI}api/client/torrents/tracker`, {
        hashes,
        tracker,
        options,
      })
      .then((json) => json.data)
      .then(
        (data) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TRACKER_SUCCESS',
            data,
          });
        },
        (error) => {
          AppDispatcher.dispatchServerAction({
            type: 'CLIENT_SET_TRACKER_ERROR',
            error,
          });
        },
      ),
};

export default TorrentActions;