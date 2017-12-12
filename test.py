import application
import unittest


class SignalingTestCase(unittest.TestCase):

    def setUp(self):
        self.app = application.app
        self.socketio = application.socketio

    def testAddNewPeer(self):
        peer_a = self.socketio.test_client(self.app)
        # first time user should be conected receive username token
        received = peer_a.get_received()
        self.assertEqual(len(received), 1)
        self.assertTrue('args' in received[0])
        args = received[0]['args']
        self.assertEqual(len(args), 1)
        args = args[0]
        self.assertTrue('token' in args)
        name = args['token']
        peer_a.emit('session', {'token': name})
        self.assertEqual(len(application.connected_peers), 1)
        self.assertIn(name, application.connected_peers)

if __name__ == '__main__':
    unittest.main()

